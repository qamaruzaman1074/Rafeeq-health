import { useTranslation } from "react-i18next";
import { userVisibleBlockId } from "@/lib/content-marker";

export function BlockBody({ text, blockId }: { text: string | null; blockId: string }) {
  const { t } = useTranslation();
  if (text === null) {
    const visibleId = userVisibleBlockId(blockId);
    return (
      <p>
        <span>{t("content.missing")}</span>
        {visibleId !== null ? (
          <>
            {" "}
            <span lang="en" dir="ltr">
              {visibleId}
            </span>
          </>
        ) : null}
      </p>
    );
  }
  return <p>{text}</p>;
}
