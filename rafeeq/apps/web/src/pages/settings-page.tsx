import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { setSessionPersona, setSessionRole } from "@/app/session";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { LiteracyModeToggle } from "@/components/literacy-mode-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  const [prefs, setPrefs] = useSessionState<NotificationPrefs>("rafeeq.demo.prefs", () => ({
    reminders: true,
    referral: true,
  }));
  const [saved, setSaved] = useState(false);

  const change = (key: keyof NotificationPrefs) => (value: boolean) => {
    setPrefs((current) => ({ ...current, [key]: value }));
    setSaved(true);
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
              {t("settingsPage.nameValue", { ns: "couple" })}
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
        <Button
          variant="secondary"
          className="w-fit"
          onClick={() => {
            setSessionPersona(null);
            setSessionRole(null);
            void navigate("/");
          }}
        >
          {t("settingsPage.signOut", { ns: "couple" })}
        </Button>
      </section>
    </AppPageLayout>
  );
}
