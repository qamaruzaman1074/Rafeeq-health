import { useEffect, useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import {
  isSupabaseAuthenticated,
  getSessionIdentity,
  setSessionPersona,
  setSessionRole,
  subscribeSession,
} from "@/app/session";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { LiteracyModeToggle } from "@/components/literacy-mode-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  deleteOwnProfile,
  errorMessageFrom,
  getOwnProfile,
  signOutSupabase,
  updateOwnProfile,
} from "@/features/auth/supabase-auth";
import { useSessionState } from "@/lib/use-session-state";

type NotificationPrefs = { reminders: boolean; referral: boolean };

const panelClass =
  "flex flex-col gap-4 rounded-xl border border-border-subtle bg-card p-5 shadow-xs sm:p-6";

function PrefRow({
  label,
  checked,
  disabled,
  note,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  note?: string;
  onChange?: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <label htmlFor={id} className="text-base font-medium text-ink-900">
          {label}
        </label>
        {note !== undefined ? <span className="text-sm text-ink-600">{note}</span> : null}
      </div>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  );
}

export function Component() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const identity = useSyncExternalStore(subscribeSession, getSessionIdentity, getSessionIdentity);
  const [prefs, setPrefs] = useSessionState<NotificationPrefs>("rafeeq.demo.prefs", () => ({
    reminders: true,
    referral: true,
  }));
  const [saved, setSaved] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileDraft, setProfileDraft] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [pendingProfileDelete, setPendingProfileDelete] = useState(false);
  const authenticated = useSyncExternalStore(
    subscribeSession,
    isSupabaseAuthenticated,
    () => false,
  );

  useEffect(() => {
    if (!authenticated) {
      return;
    }
    setLoadingProfile(true);
    let active = true;
    void getOwnProfile()
      .then((profile) => {
        if (active) {
          setProfileName(profile?.display_name ?? null);
          setProfileDraft(profile?.display_name ?? "");
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setProfileError(
            errorMessageFrom(error, t("settingsPage.profileDeleteError", { ns: "couple" })),
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoadingProfile(false);
        }
      });
    return () => {
      active = false;
    };
  }, [authenticated, t]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authenticated || savingProfile) {
      return;
    }
    setSavingProfile(true);
    setProfileError(null);
    setProfileStatus(null);
    try {
      const profile = await updateOwnProfile(profileDraft);
      setProfileName(profile.display_name);
      setProfileDraft(profile.display_name ?? "");
      setProfileStatus(t("settingsPage.profileSaved", { ns: "couple" }));
      await queryClient.invalidateQueries({
        queryKey: ["profile", "account-display", identity],
      });
    } catch (error) {
      setProfileError(
        errorMessageFrom(error, t("settingsPage.profileUpdateError", { ns: "couple" })),
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const change = (key: keyof NotificationPrefs) => (value: boolean) => {
    setPrefs((current) => ({ ...current, [key]: value }));
    setSaved(true);
  };

  const removeProfile = async () => {
    if (!authenticated || pendingProfileDelete) {
      return;
    }
    if (!window.confirm(t("settingsPage.deleteProfileConfirm", { ns: "couple" }))) {
      return;
    }
    setPendingProfileDelete(true);
    setProfileError(null);
    setProfileStatus(null);
    try {
      const deleted = await deleteOwnProfile();
      setProfileName(null);
      setProfileDraft("");
      setProfileStatus(
        t(deleted ? "settingsPage.profileDeleted" : "settingsPage.profileNotFound", {
          ns: "couple",
        }),
      );
      await queryClient.invalidateQueries({
        queryKey: ["profile", "account-display", identity],
      });
    } catch (error) {
      setProfileError(
        errorMessageFrom(error, t("settingsPage.profileDeleteError", { ns: "couple" })),
      );
    } finally {
      setPendingProfileDelete(false);
    }
  };

  const signOut = async () => {
    setSignOutError(null);
    try {
      if (authenticated) {
        await signOutSupabase();
      }
      setSessionPersona(null);
      setSessionRole(null);
      await navigate("/");
    } catch (error) {
      setSignOutError(errorMessageFrom(error, t("settingsPage.signOutError", { ns: "couple" })));
    }
  };

  return (
    <AppPageLayout>
      <PageHeader
        title={t("settingsPage.title", { ns: "couple" })}
        description={t("settingsPage.intro", { ns: "couple" })}
      />

      <section aria-labelledby="settings-profile" className={panelClass}>
        <h2 id="settings-profile" className="text-lg font-semibold text-teal-900">
          {t("settingsPage.profileHeading", { ns: "couple" })}
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink-600">
              {t("settingsPage.nameLabel", { ns: "couple" })}
            </dt>
            <dd className="text-base font-medium text-ink-900">
              {authenticated
                ? loadingProfile
                  ? t("settingsPage.loadingProfile", { ns: "couple" })
                  : (profileName ?? t("settingsPage.noProfile", { ns: "couple" }))
                : t("settingsPage.nameValue", { ns: "couple" })}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-600">
              {t("settingsPage.languageLabel", { ns: "couple" })}
            </dt>
            <dd className="text-base font-medium text-ink-900">
              {t("settingsPage.languageValue", { ns: "couple" })}
            </dd>
          </div>
        </dl>
        {authenticated ? (
          <form
            className="flex flex-col items-start gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:items-end"
            onSubmit={(event) => void saveProfile(event)}
          >
            <div className="flex w-full max-w-md flex-col gap-2">
              <label htmlFor="profile-display-name" className="text-sm font-semibold text-teal-900">
                {t("settingsPage.editNameLabel", { ns: "couple" })}
              </label>
              <input
                id="profile-display-name"
                name="displayName"
                type="text"
                autoComplete="name"
                required
                maxLength={120}
                disabled={loadingProfile}
                value={profileDraft}
                onChange={(event) => {
                  setProfileDraft(event.target.value);
                  setProfileError(null);
                  setProfileStatus(null);
                }}
                className="min-h-12 w-full rounded-lg border border-border-subtle bg-background px-3 text-base text-ink-900 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              />
            </div>
            <Button type="submit" disabled={savingProfile || loadingProfile}>
              {savingProfile
                ? t("settingsPage.savingProfile", { ns: "couple" })
                : t("settingsPage.saveProfile", { ns: "couple" })}
            </Button>
          </form>
        ) : null}
        {profileStatus !== null ? (
          <p role="status" className="text-sm text-teal-900">
            {profileStatus}
          </p>
        ) : null}
        {profileError !== null ? (
          <p role="alert" className="text-sm text-destructive">
            {profileError}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="settings-display" className={panelClass}>
        <h2 id="settings-display" className="text-lg font-semibold text-teal-900">
          {t("settingsPage.displayHeading", { ns: "couple" })}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-base font-medium text-ink-900">
            {t("settingsPage.themeLabel", { ns: "couple" })}
          </span>
          <ThemeToggle />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium text-ink-900">
            {t("settingsPage.literacyLabel", { ns: "couple" })}
          </span>
          <LiteracyModeToggle />
        </div>
      </section>

      <section aria-labelledby="settings-notifications" className={panelClass}>
        <h2 id="settings-notifications" className="text-lg font-semibold text-teal-900">
          {t("settingsPage.notificationsHeading", { ns: "couple" })}
        </h2>
        <PrefRow
          label={t("settingsPage.essential", { ns: "couple" })}
          note={t("settingsPage.essentialNote", { ns: "couple" })}
          checked
          disabled
        />
        <PrefRow
          label={t("settingsPage.reminders", { ns: "couple" })}
          checked={prefs.reminders}
          onChange={change("reminders")}
        />
        <PrefRow
          label={t("settingsPage.referral", { ns: "couple" })}
          checked={prefs.referral}
          onChange={change("referral")}
        />
        <p role="status" className="text-sm text-teal-900">
          {saved ? t("settingsPage.saved", { ns: "couple" }) : ""}
        </p>
      </section>

      <section aria-labelledby="settings-privacy" className={panelClass}>
        <h2 id="settings-privacy" className="text-lg font-semibold text-teal-900">
          {t("settingsPage.privacyHeading", { ns: "couple" })}
        </h2>
        <p className="text-base text-ink-600">{t("settingsPage.privacyBody", { ns: "couple" })}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/app/privacy">{t("settingsPage.privacyLink", { ns: "couple" })}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/app/partner">{t("settingsPage.partnerLink", { ns: "couple" })}</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="settings-security" className={panelClass}>
        <h2 id="settings-security" className="text-lg font-semibold text-teal-900">
          {t("settingsPage.securityHeading", { ns: "couple" })}
        </h2>
        <p className="text-base text-ink-600">{t("settingsPage.securityBody", { ns: "couple" })}</p>
        <p className="text-sm text-ink-600">{t("settingsPage.signOutBody", { ns: "couple" })}</p>
        {authenticated ? (
          <div className="flex flex-col gap-3 border-t border-border-subtle pt-4">
            <p className="text-sm text-ink-600">
              {t("settingsPage.deleteProfileBody", { ns: "couple" })}
            </p>
            <Button
              className="w-fit"
              disabled={pendingProfileDelete}
              onClick={() => void removeProfile()}
              variant="destructive"
            >
              {pendingProfileDelete
                ? t("settingsPage.deletingProfile", { ns: "couple" })
                : t("settingsPage.deleteProfile", { ns: "couple" })}
            </Button>
          </div>
        ) : null}
        {signOutError !== null ? (
          <p role="alert" className="text-sm text-destructive">
            {signOutError}
          </p>
        ) : null}
        <Button variant="secondary" className="w-fit" onClick={() => void signOut()}>
          {t("settingsPage.signOut", { ns: "couple" })}
        </Button>
      </section>
    </AppPageLayout>
  );
}
