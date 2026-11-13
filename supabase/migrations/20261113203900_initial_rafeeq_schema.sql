create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (display_name is null or length(display_name) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.is_clinic_staff()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role' = 'counsellor', false);
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger auth_user_created_profile
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy profiles_select_own
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy profiles_update_own
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy profiles_delete_own
on public.profiles for delete to authenticated
using ((select auth.uid()) = id);

grant select, delete on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

create table public.consent_preferences (
  user_id uuid not null references auth.users (id) on delete cascade,
  scope text not null check (
    scope in ('view_own', 'share_overlap_with_partner', 'share_with_clinic', 'research_aggregate')
  ),
  granted boolean not null,
  version integer not null default 1 check (version > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, scope)
);

create table public.consent_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  scope text not null,
  granted boolean not null,
  version integer not null,
  created_at timestamptz not null default now()
);

create function public.version_consent_preference()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    new.version := old.version + 1;
  else
    new.version := 1;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create function public.record_consent_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.consent_events (user_id, scope, granted, version)
  values (new.user_id, new.scope, new.granted, new.version);
  return new;
end;
$$;

create trigger consent_preferences_version
before insert or update on public.consent_preferences
for each row execute function public.version_consent_preference();

create trigger consent_preferences_audit
after insert or update on public.consent_preferences
for each row execute function public.record_consent_event();

alter table public.consent_preferences enable row level security;
alter table public.consent_events enable row level security;

create policy consent_preferences_select_own
on public.consent_preferences for select to authenticated
using ((select auth.uid()) = user_id);

create policy consent_preferences_insert_own
on public.consent_preferences for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy consent_preferences_update_own
on public.consent_preferences for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy consent_events_select_own
on public.consent_events for select to authenticated
using ((select auth.uid()) = user_id);

grant select on public.consent_preferences, public.consent_events to authenticated;
grant insert (user_id, scope, granted) on public.consent_preferences to authenticated;
grant update (granted) on public.consent_preferences to authenticated;

create table public.partnerships (
  id uuid primary key default gen_random_uuid(),
  member_a uuid not null references auth.users (id) on delete cascade,
  member_b uuid not null references auth.users (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (member_a <> member_b)
);

create unique index partnerships_active_members
on public.partnerships (least(member_a, member_b), greatest(member_a, member_b))
where status = 'active';

create table public.partner_invitations (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references auth.users (id) on delete cascade,
  invitee_id uuid not null references auth.users (id) on delete cascade,
  invite_code text not null unique default replace(gen_random_uuid()::text, '-', ''),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (inviter_id <> invitee_id)
);

create table public.partnership_consent_grants (
  partnership_id uuid not null references public.partnerships (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  category text not null check (category in ('carrierFindings', 'reportInfo', 'referralInfo')),
  granted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (partnership_id, user_id, category)
);

create table public.sharing_history (
  id uuid primary key default gen_random_uuid(),
  partnership_id uuid not null references public.partnerships (id) on delete cascade,
  actor_id uuid not null references auth.users (id) on delete cascade,
  category text not null,
  granted boolean not null,
  created_at timestamptz not null default now()
);

create function public.record_sharing_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.sharing_history (partnership_id, actor_id, category, granted)
  values (new.partnership_id, new.user_id, new.category, new.granted);
  return new;
end;
$$;

create trigger partnership_consent_grants_audit
after insert or update on public.partnership_consent_grants
for each row execute function public.record_sharing_change();

create function public.respond_to_partner_invitation(
  invitation_id uuid,
  accept_invitation boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  invitation public.partner_invitations%rowtype;
  partnership_uuid uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  select *
    into invitation
    from public.partner_invitations
    where id = invitation_id
    for update;

  if not found
    or invitation.invitee_id <> (select auth.uid())
    or invitation.status <> 'pending' then
    raise exception 'Invitation is unavailable';
  end if;

  if accept_invitation then
    select p.id
      into partnership_uuid
      from public.partnerships p
      where p.status = 'active'
        and (p.member_a, p.member_b) in (
          (invitation.inviter_id, invitation.invitee_id),
          (invitation.invitee_id, invitation.inviter_id)
        )
      limit 1;
    if partnership_uuid is null then
      insert into public.partnerships (member_a, member_b)
      values (invitation.inviter_id, invitation.invitee_id)
      returning id into partnership_uuid;
    end if;
    update public.partner_invitations
      set status = 'accepted', responded_at = now()
      where id = invitation.id;
  else
    update public.partner_invitations
      set status = 'declined', responded_at = now()
      where id = invitation.id;
  end if;

  return partnership_uuid;
end;
$$;

create function public.cancel_partner_invitation(invitation_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.partner_invitations
    set status = 'cancelled', responded_at = now()
    where id = invitation_id
      and inviter_id = (select auth.uid())
      and status = 'pending';

  if not found then
    raise exception 'Invitation is unavailable';
  end if;
end;
$$;

alter table public.partnerships enable row level security;
alter table public.partner_invitations enable row level security;
alter table public.partnership_consent_grants enable row level security;
alter table public.sharing_history enable row level security;

create policy partnerships_select_member
on public.partnerships for select to authenticated
using (
  (select auth.uid()) in (member_a, member_b)
);

create policy partner_invitations_select_participant
on public.partner_invitations for select to authenticated
using ((select auth.uid()) in (inviter_id, invitee_id));

create policy partner_invitations_insert_inviter
on public.partner_invitations for insert to authenticated
with check (
  inviter_id = (select auth.uid())
  and invitee_id <> (select auth.uid())
  and status = 'pending'
);

create policy partnership_consent_grants_select_member
on public.partnership_consent_grants for select to authenticated
using (
  exists (
    select 1
      from public.partnerships p
      where p.id = partnership_id
        and p.status = 'active'
        and (select auth.uid()) in (p.member_a, p.member_b)
  )
);

create policy partnership_consent_grants_insert_owner
on public.partnership_consent_grants for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
      from public.partnerships p
      where p.id = partnership_id
        and p.status = 'active'
        and (select auth.uid()) in (p.member_a, p.member_b)
  )
);

create policy partnership_consent_grants_update_owner
on public.partnership_consent_grants for update to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1
      from public.partnerships p
      where p.id = partnership_id
        and p.status = 'active'
        and (select auth.uid()) in (p.member_a, p.member_b)
  )
)
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
      from public.partnerships p
      where p.id = partnership_id
        and p.status = 'active'
        and (select auth.uid()) in (p.member_a, p.member_b)
  )
);

create policy sharing_history_select_member
on public.sharing_history for select to authenticated
using (
  exists (
    select 1
      from public.partnerships p
      where p.id = partnership_id
        and (select auth.uid()) in (p.member_a, p.member_b)
  )
);

grant select on public.partnerships, public.partner_invitations,
  public.partnership_consent_grants, public.sharing_history to authenticated;
grant insert (inviter_id, invitee_id) on public.partner_invitations to authenticated;
grant insert (partnership_id, user_id, category, granted)
  on public.partnership_consent_grants to authenticated;
grant update (granted) on public.partnership_consent_grants to authenticated;
grant execute on function public.respond_to_partner_invitation(uuid, boolean) to authenticated;
grant execute on function public.cancel_partner_invitation(uuid) to authenticated;

create table public.pathway_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  step_id text not null check (
    step_id in (
      'result_received',
      'counselling',
      'confirmatory_assessment',
      'specialised_services',
      'follow_up'
    )
  ),
  reached boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, step_id)
);

create trigger pathway_progress_set_updated_at
before update on public.pathway_progress
for each row execute function public.set_updated_at();

alter table public.pathway_progress enable row level security;

create policy pathway_progress_owner
on public.pathway_progress for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.pathway_progress to authenticated;

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'created'
    check (status in ('created', 'sent', 'booked', 'attended', 'confirmatory_ordered', 'closed')),
  preferred_language text check (preferred_language is null or preferred_language in ('ar', 'en')),
  literacy_mode text check (
    literacy_mode is null or literacy_mode in ('standard', 'simple', 'voice')
  ),
  assigned_counsellor_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.clinic_can_access_referral(referral_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_clinic_staff()
    and exists (
      select 1
        from public.referrals r
        join public.consent_preferences c on c.user_id = r.requester_id
        where r.id = referral_uuid
          and c.scope = 'share_with_clinic'
          and c.granted
    );
$$;

create table public.clinic_audit_events (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (action in ('created', 'status_changed')),
  status text not null,
  created_at timestamptz not null default now()
);

create function public.record_referral_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.clinic_audit_events (referral_id, actor_id, action, status)
    values (new.id, new.requester_id, 'created', new.status);
  elsif new.status is distinct from old.status then
    insert into public.clinic_audit_events (referral_id, actor_id, action, status)
    values (new.id, (select auth.uid()), 'status_changed', new.status);
  end if;
  return new;
end;
$$;

create trigger referrals_set_updated_at
before update on public.referrals
for each row execute function public.set_updated_at();

create trigger referrals_audit
after insert or update on public.referrals
for each row execute function public.record_referral_change();

alter table public.referrals enable row level security;
alter table public.clinic_audit_events enable row level security;

create policy referrals_select_owner
on public.referrals for select to authenticated
using ((select auth.uid()) = requester_id);

create policy referrals_select_clinic_staff
on public.referrals for select to authenticated
using (public.clinic_can_access_referral(id));

create policy referrals_insert_owner
on public.referrals for insert to authenticated
with check (
  requester_id = (select auth.uid())
  and status = 'created'
  and assigned_counsellor_id is null
  and exists (
    select 1
      from public.consent_preferences c
      where c.user_id = (select auth.uid())
        and c.scope = 'share_with_clinic'
        and c.granted
  )
);

create policy referrals_update_clinic_staff
on public.referrals for update to authenticated
using (public.clinic_can_access_referral(id))
with check (public.clinic_can_access_referral(id));

create policy clinic_audit_select_clinic_staff
on public.clinic_audit_events for select to authenticated
using (
  exists (
    select 1
      from public.referrals r
      where r.id = referral_id
        and public.clinic_can_access_referral(r.id)
  )
);

grant select on public.referrals, public.clinic_audit_events to authenticated;
grant insert (requester_id, preferred_language, literacy_mode) on public.referrals to authenticated;
grant update (status, assigned_counsellor_id, preferred_language, literacy_mode)
  on public.referrals to authenticated;

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  notification_key text not null check (
    notification_key in (
      'reportReady',
      'inconclusiveExplained',
      'invitePending',
      'consentUpdated',
      'referralChanged'
    )
  ),
  href text not null check (href like '/%' and href not like '//%'),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy notifications_select_own
on public.notifications for select to authenticated
using ((select auth.uid()) = user_id);

create policy notifications_insert_own
on public.notifications for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy notifications_update_own
on public.notifications for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant select on public.notifications to authenticated;
grant insert (user_id, notification_key, href) on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;
revoke all on function public.record_consent_event() from public, anon, authenticated;
revoke all on function public.record_sharing_change() from public, anon, authenticated;
revoke all on function public.record_referral_change() from public, anon, authenticated;
revoke all on function public.respond_to_partner_invitation(uuid, boolean) from public, anon;
revoke all on function public.cancel_partner_invitation(uuid) from public, anon;
revoke all on function public.is_clinic_staff() from public, anon;
grant execute on function public.is_clinic_staff() to authenticated;
revoke all on function public.clinic_can_access_referral(uuid) from public, anon;
grant execute on function public.clinic_can_access_referral(uuid) to authenticated;

revoke all on table
  public.profiles,
  public.consent_preferences,
  public.consent_events,
  public.partnerships,
  public.partner_invitations,
  public.partnership_consent_grants,
  public.sharing_history,
  public.pathway_progress,
  public.referrals,
  public.clinic_audit_events,
  public.notifications
from public, anon, authenticated;

grant select, delete on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

grant select on public.consent_preferences, public.consent_events to authenticated;
grant insert (user_id, scope, granted) on public.consent_preferences to authenticated;
grant update (granted) on public.consent_preferences to authenticated;

grant select on public.partnerships, public.partner_invitations,
  public.partnership_consent_grants, public.sharing_history to authenticated;
grant insert (inviter_id, invitee_id) on public.partner_invitations to authenticated;
grant insert (partnership_id, user_id, category, granted)
  on public.partnership_consent_grants to authenticated;
grant update (granted) on public.partnership_consent_grants to authenticated;

grant select, insert, update, delete on public.pathway_progress to authenticated;

grant select on public.referrals, public.clinic_audit_events to authenticated;
grant insert (requester_id, preferred_language, literacy_mode) on public.referrals to authenticated;
grant update (status, assigned_counsellor_id, preferred_language, literacy_mode)
  on public.referrals to authenticated;

grant select on public.notifications to authenticated;
grant insert (user_id, notification_key, href) on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;
