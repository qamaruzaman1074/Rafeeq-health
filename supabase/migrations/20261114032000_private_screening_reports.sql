create table public.screening_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  access_code text not null check (access_code ~ '^[0-9]{6}$'),
  object_path text not null unique,
  file_name text not null check (length(file_name) between 1 and 255),
  mime_type text not null check (mime_type = 'text/plain'),
  file_size bigint not null check (file_size between 1 and 10485760),
  created_at timestamptz not null default now(),
  unique (user_id, access_code),
  check (split_part(object_path, '/', 1) = user_id::text)
);

create index screening_reports_owner_created_at
on public.screening_reports (user_id, created_at desc);

alter table public.screening_reports enable row level security;

create policy screening_reports_select_own
on public.screening_reports for select to authenticated
using ((select auth.uid()) = user_id);

create policy screening_reports_insert_own
on public.screening_reports for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy screening_reports_delete_own
on public.screening_reports for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.screening_reports from public, anon, authenticated;
grant select, insert, delete on public.screening_reports to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'report_rafeeq',
  'report_rafeeq',
  false,
  10485760,
  array['text/plain']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy report_rafeeq_select_own
on storage.objects for select to authenticated
using (
  bucket_id = 'report_rafeeq'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and cardinality(storage.foldername(name)) = 1
);

create policy report_rafeeq_insert_own
on storage.objects for insert to authenticated
with check (
  bucket_id = 'report_rafeeq'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and cardinality(storage.foldername(name)) = 1
);

create policy report_rafeeq_delete_own
on storage.objects for delete to authenticated
using (
  bucket_id = 'report_rafeeq'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and cardinality(storage.foldername(name)) = 1
);
