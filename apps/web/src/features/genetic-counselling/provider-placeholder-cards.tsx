import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList } from "@/i18n/copy-list";

type DemoProfile = {
  name: string;
  role: string;
  experience: string;
  email: string;
  image: string;
};

export function ProviderPlaceholderCards() {
  const { t } = useTranslation();
  const profiles = useCopyList<DemoProfile>("counsellingPage.demoProfiles", "public");

  return (
    <section aria-labelledby="provider-slots-heading">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <h2 id="provider-slots-heading" className="text-2xl font-semibold text-teal-900">
          {t("counsellingPage.profilesHeading", { ns: "public" })}
        </h2>
        <Badge variant="notice">{t("counsellingPage.demoProfileBadge", { ns: "public" })}</Badge>
      </div>
      <p className="mb-6 max-w-3xl text-base text-ink-600">
        {t("counsellingPage.profilesIntro", { ns: "public" })}
      </p>
      <p className="mb-6 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {t("counsellingPage.profilesContactNote", { ns: "public" })}
      </p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {profiles.map((profile) => (
          <li key={profile.name}>
            <Card className="h-full overflow-hidden">
              <CardHeader className="gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    loading="lazy"
                    decoding="async"
                    className="size-20 shrink-0 rounded-2xl object-cover shadow-sm ring-2 ring-teal-100"
                  />
                  <div className="min-w-0">
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <CardDescription className="mt-1 text-sm font-medium text-teal-800">
                      {profile.role}
                    </CardDescription>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-ink-600">{profile.experience}</p>
                <p className="border-t border-border-subtle pt-3 text-sm">
                  <span className="font-medium text-teal-900">
                    {t("counsellingPage.emailLabel", { ns: "public" })}{" "}
                  </span>
                  <span className="break-all text-ink-600">{profile.email}</span>
                </p>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
