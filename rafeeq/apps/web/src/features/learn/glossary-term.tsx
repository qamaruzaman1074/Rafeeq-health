import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ErrorState, humanContact } from "@/components/error-state";
import { Skeleton } from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { useFailureToast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchGlossary } from "@/features/learn/api";
import type { LocaleCode } from "@/features/learn/blocks";
import { BlockBody } from "@/features/learn/block-body";

export function GlossaryTerm({
  term,
  termKey,
  locale,
  large,
}: {
  term: string;
  termKey: string;
  locale: LocaleCode;
  large: boolean;
}) {
  const { t } = useTranslation();
  const termLabel = t(termKey, { ns: "learn" });
  const name = t("glossary.termName", { ns: "learn", term: termLabel, id: term });
  const glossary = useQuery({
    queryKey: ["glossary", term, locale],
    queryFn: () => fetchGlossary(term, locale),
    retry: false,
  });
  const contact = humanContact(t);
  useFailureToast(glossary.isError, t("error", { ns: "learn" }));

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          aria-label={name}
          className={large ? "min-h-20 w-full text-3xl" : undefined}
        >
          {termLabel}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {glossary.isPending ? <Skeleton label={t("glossary.loading", { ns: "learn" })} /> : null}
        {glossary.isError ? (
          <ErrorState
            title={t("error", { ns: "learn" })}
            retryLabel={t("retry", { ns: "learn" })}
            onRetry={() => {
              void glossary.refetch();
            }}
            {...contact}
          />
        ) : null}
        {glossary.isSuccess ? (
          <BlockBody text={glossary.data.text} blockId={glossary.data.block_id} />
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}
