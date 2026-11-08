import { useTranslation } from "react-i18next";

export function BlockBody({ text, blockId }: { text: string | null; blockId: string }) {
  const { t } = useTranslation();
  if (text === null) {
    return (
      <p>
        <span>{t("content.missing")}</span>{" "}
        <span lang="en" dir="ltr">
          {blockId}
        </span>
      </p>
    );
  }
  return <p>{text}</p>;
}
