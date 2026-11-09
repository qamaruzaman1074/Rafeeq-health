import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyList } from "@/i18n/copy-list";

type DemoProfile = {
  name: string;
  role: string;
  experience: string;
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
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {profiles.map((profile) => (
          <li key={profile.name}>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <img
                  src={profile.image}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                  className="size-16 shrink-0 rounded-full border border-border-subtle object-cover"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <CardTitle className="text-lg">{profile.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-teal-800">
                    {profile.role}
                  </CardDescription>
                  <p className="text-sm text-ink-600">{profile.experience}</p>
                </div>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
