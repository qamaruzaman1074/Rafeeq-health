import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { documentLocale, type AppDirection, type AppLocale } from "@/i18n/locale";

type Translate = (key: string) => string;

type Frame = {
  t: Translate;
  dir: AppDirection;
  lang: AppLocale;
};

const swatches = [
  { chip: "bg-teal-900", label: "styleguide.colour.teal900" },
  { chip: "bg-teal-700", label: "styleguide.colour.teal700" },
  { chip: "bg-teal-500", label: "styleguide.colour.teal500" },
  { chip: "bg-teal-100", label: "styleguide.colour.teal100" },
  { chip: "bg-sand-50", label: "styleguide.colour.sand50" },
  { chip: "bg-sand-100", label: "styleguide.colour.sand100" },
  { chip: "bg-gold-500", label: "styleguide.colour.gold500" },
  { chip: "bg-lilac-100", label: "styleguide.colour.lilac100" },
  { chip: "bg-amber-100", label: "styleguide.colour.amber100" },
  { chip: "bg-green-600", label: "styleguide.colour.green600" },
  { chip: "bg-ink-900", label: "styleguide.colour.ink900" },
  { chip: "bg-ink-600", label: "styleguide.colour.ink600" },
  { chip: "bg-danger-600", label: "styleguide.colour.danger600" },
] as const;

const typeSteps = [
  { label: "styleguide.type.sm", className: "text-sm" },
  { label: "styleguide.type.base", className: "font-normal" },
  { label: "styleguide.type.lg", className: "text-lg" },
  { label: "styleguide.type.xl", className: "text-xl" },
  { label: "styleguide.type.2xl", className: "text-2xl" },
  { label: "styleguide.type.3xl", className: "text-3xl" },
  { label: "styleguide.type.4xl", className: "text-4xl" },
] as const;

function fixedTranslate(translate: (key: string) => unknown): Translate {
  return (key) => {
    const value = translate(key);
    return typeof value === "string" ? value : key;
  };
}

function Pair({ heading, children }: { heading: string; children: (frame: Frame) => ReactNode }) {
  const { t, i18n } = useTranslation();
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-teal-900">{t(heading)}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {(["en", "ar"] as const).map((lang) => {
          const dir: AppDirection = lang === "ar" ? "rtl" : "ltr";
          const frame: Frame = {
            lang,
            dir,
            t: fixedTranslate(i18n.getFixedT(lang)),
          };
          return (
            <div
              key={lang}
              lang={lang}
              dir={dir}
              className="flex flex-col gap-3 rounded-lg border border-teal-500 bg-sand-50 p-4"
            >
              <p className="text-sm text-ink-600">{frame.t("styleguide.frame.label")}</p>
              {children(frame)}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ColourFrame({ t }: Frame) {
  return (
    <ul className="flex flex-col gap-3">
      {swatches.map((swatch) => (
        <li key={swatch.label} className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`h-11 w-11 shrink-0 rounded-md border border-teal-500 ${swatch.chip}`}
          />
          <span className="text-base text-ink-900">{t(swatch.label)}</span>
        </li>
      ))}
    </ul>
  );
}

function TypeFrame({ t }: Frame) {
  return (
    <div className="flex flex-col gap-3">
      {typeSteps.map((step) => (
        <p key={step.label} className={`${step.className} text-ink-900`}>
          <span className="text-sm text-ink-600">{t(step.label)}. </span>
          {t("styleguide.type.sample")}
        </p>
      ))}
    </div>
  );
}

function ButtonFrame({ t }: Frame) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>{t("styleguide.button.primary")}</Button>
      <Button variant="secondary">{t("styleguide.button.secondary")}</Button>
      <Button variant="ghost">{t("styleguide.button.ghost")}</Button>
      <Button variant="link">{t("styleguide.button.link")}</Button>
      <Button variant="destructive">{t("styleguide.button.destructive")}</Button>
    </div>
  );
}

function CardFrame({ t }: Frame) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("styleguide.card.title")}</CardTitle>
        <CardDescription>{t("styleguide.card.body")}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function BadgeFrame({ t }: Frame) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>{t("styleguide.badge.neutral")}</Badge>
      <Badge variant="notice">{t("styleguide.badge.notice")}</Badge>
      <Badge variant="conversation">{t("styleguide.badge.conversation")}</Badge>
      <Badge variant="positive">{t("styleguide.badge.positive")}</Badge>
      <Badge variant="error">{t("styleguide.badge.error")}</Badge>
    </div>
  );
}

function DialogFrame({ t, dir, lang }: Frame) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{t("styleguide.dialog.open")}</Button>
      </DialogTrigger>
      <DialogContent dir={dir} lang={lang} closeLabel={t("common.close")}>
        <DialogTitle className="text-xl font-semibold text-teal-900">
          {t("styleguide.dialog.title")}
        </DialogTitle>
        <DialogDescription className="text-base text-ink-600">
          {t("styleguide.dialog.body")}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function DrawerFrame({ t, dir, lang }: Frame) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">{t("styleguide.drawer.open")}</Button>
      </DrawerTrigger>
      <DrawerContent dir={dir} lang={lang} closeLabel={t("common.close")}>
        <DrawerTitle className="text-xl font-semibold text-teal-900">
          {t("styleguide.drawer.title")}
        </DrawerTitle>
        <DrawerDescription className="text-base text-ink-600">
          {t("styleguide.drawer.body")}
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}

function TabsFrame({ t, dir }: Frame) {
  return (
    <Tabs defaultValue="one" dir={dir}>
      <TabsList aria-label={t("styleguide.tabs.heading")}>
        <TabsTrigger value="one">{t("styleguide.tabs.one")}</TabsTrigger>
        <TabsTrigger value="two">{t("styleguide.tabs.two")}</TabsTrigger>
      </TabsList>
      <TabsContent value="one">{t("styleguide.tabs.oneBody")}</TabsContent>
      <TabsContent value="two">{t("styleguide.tabs.twoBody")}</TabsContent>
    </Tabs>
  );
}

function TooltipFrame({ t, dir, lang }: Frame) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">{t("styleguide.tooltip.trigger")}</Button>
      </TooltipTrigger>
      <TooltipContent dir={dir} lang={lang}>
        {t("styleguide.tooltip.body")}
      </TooltipContent>
    </Tooltip>
  );
}

function SwitchFrame({ t }: Frame) {
  return (
    <label className="flex items-center gap-3 text-base text-ink-900">
      <Switch />
      <span>{t("styleguide.switch.label")}</span>
    </label>
  );
}

function ToastFrame({ t, dir, lang }: Frame) {
  const { push } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => {
          push({
            title: t("styleguide.toastDemo.title"),
            description: t("styleguide.toastDemo.body"),
            dismissLabel: t("toast.dismiss"),
            dir,
            lang,
          });
        }}
      >
        {t("styleguide.toastDemo.show")}
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          push({
            title: t("styleguide.toastDemo.errorTitle"),
            description: t("styleguide.toastDemo.errorBody"),
            dismissLabel: t("toast.dismiss"),
            variant: "error",
            dir,
            lang,
          });
        }}
      >
        {t("styleguide.toastDemo.showError")}
      </Button>
    </div>
  );
}

function FocusFrame({ t }: Frame) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-base text-ink-600">{t("styleguide.focus.body")}</p>
      <Button variant="secondary">{t("styleguide.focus.target")}</Button>
    </div>
  );
}

function LanguageSwitch() {
  const { t, i18n } = useTranslation();
  const active = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;
  return (
    <div role="group" aria-label={t("common.language")} className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        aria-pressed={active === "en"}
        onClick={() => {
          void i18n.changeLanguage("en");
        }}
      >
        {t("styleguide.language.en")}
      </Button>
      <Button
        variant="secondary"
        aria-pressed={active === "ar"}
        onClick={() => {
          void i18n.changeLanguage("ar");
        }}
      >
        {t("styleguide.language.ar")}
      </Button>
    </div>
  );
}

export function StyleguidePage() {
  const { t, i18n } = useTranslation();
  const locale = documentLocale(i18n.resolvedLanguage ?? i18n.language);

  useEffect(() => {
    document.title = t("styleguide.documentTitle");
    return () => {
      document.title = t("app.documentTitle");
    };
  }, [i18n.language, t]);

  return (
    <TooltipProvider delayDuration={200}>
      <ToastProvider>
        <main className="ms-auto me-auto flex w-full max-w-5xl flex-col gap-10 p-6">
          <header className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold text-teal-900">{t("styleguide.title")}</h1>
            <p className="max-w-3xl text-base text-ink-900">{t("styleguide.intro")}</p>
            <p className="text-sm text-ink-600">
              {t("styleguide.documentStatus", { lang: locale.lang, dir: locale.dir })}
            </p>
            <LanguageSwitch />
          </header>
          <Pair heading="styleguide.colour.heading">{(frame) => <ColourFrame {...frame} />}</Pair>
          <Pair heading="styleguide.type.heading">{(frame) => <TypeFrame {...frame} />}</Pair>
          <Pair heading="styleguide.button.heading">{(frame) => <ButtonFrame {...frame} />}</Pair>
          <Pair heading="styleguide.card.heading">{(frame) => <CardFrame {...frame} />}</Pair>
          <Pair heading="styleguide.badge.heading">{(frame) => <BadgeFrame {...frame} />}</Pair>
          <Pair heading="styleguide.dialog.heading">{(frame) => <DialogFrame {...frame} />}</Pair>
          <Pair heading="styleguide.drawer.heading">{(frame) => <DrawerFrame {...frame} />}</Pair>
          <Pair heading="styleguide.tabs.heading">{(frame) => <TabsFrame {...frame} />}</Pair>
          <Pair heading="styleguide.tooltip.heading">{(frame) => <TooltipFrame {...frame} />}</Pair>
          <Pair heading="styleguide.switch.heading">{(frame) => <SwitchFrame {...frame} />}</Pair>
          <Pair heading="styleguide.toastDemo.heading">{(frame) => <ToastFrame {...frame} />}</Pair>
          <Pair heading="styleguide.focus.heading">{(frame) => <FocusFrame {...frame} />}</Pair>
        </main>
      </ToastProvider>
    </TooltipProvider>
  );
}
