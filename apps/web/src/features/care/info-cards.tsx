import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stepLabel } from "@/features/care/labels";
import { CARE_BLOCKS, INFO_CARD_IDS, type InfoCardId } from "@/features/care/steps";
import { BlockBody } from "@/features/learn/block-body";
import { readLocaleBlock, type LocaleCode } from "@/features/learn/blocks";
import { documentLocale } from "@/i18n/locale";

function cardBlock(id: InfoCardId): string {
  return CARE_BLOCKS[id];
}

export function InfoCards() {
  const { i18n, t } = useTranslation();
  const locale: LocaleCode = documentLocale(i18n.resolvedLanguage ?? i18n.language).lang;

  return (
    <div className="flex flex-col gap-4">
      {INFO_CARD_IDS.map((id) => {
        const blockId = cardBlock(id);
        const block = readLocaleBlock(locale, blockId);
        return (
          <article key={id} data-info={id}>
            <Card className="hover:shadow-surface">
              <CardHeader>
                <CardTitle className="text-2xl">{stepLabel(id, t)}</CardTitle>
                <Badge variant="notice">{t("infoOnly", { ns: "care" })}</Badge>
              </CardHeader>
              <CardContent>
                <BlockBody text={block.text} blockId={blockId} />
              </CardContent>
            </Card>
          </article>
        );
      })}
    </div>
  );
}
