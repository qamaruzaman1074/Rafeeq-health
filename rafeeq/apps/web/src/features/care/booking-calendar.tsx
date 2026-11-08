import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { periodLabel } from "@/features/care/labels";
import { landmarkName } from "@/lib/landmark-name";
import { useNumerals } from "@/i18n/numerals";

/**
 * OPEN_QUESTION: Section 6 has no booking route. These slots stay in the browser.
 */
export const BOOKING_SLOTS = [
  { id: "slot-10-morning", at: "2026-11-10T09:00:00.000Z", period: "morning" },
  { id: "slot-10-afternoon", at: "2026-11-10T13:00:00.000Z", period: "afternoon" },
  { id: "slot-12-morning", at: "2026-11-12T09:00:00.000Z", period: "morning" },
  { id: "slot-17-morning", at: "2026-11-17T09:00:00.000Z", period: "morning" },
] as const;

export type BookingSlot = (typeof BOOKING_SLOTS)[number];

export function BookingCalendar() {
  const { t } = useTranslation();
  const { formatDate } = useNumerals();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section
      className="flex flex-col items-start gap-4"
      aria-label={landmarkName(
        t("booking.label", { ns: "care" }),
        t("booking.label", { ns: "care", lng: "en" }),
      )}
    >
      <h2 id="care-booking" className="text-2xl font-semibold text-teal-900">
        {t("booking.label", { ns: "care" })}
      </h2>
      <p>{t("booking.localOnly", { ns: "care" })}</p>
      <div
        role="group"
        aria-label={t("booking.label", { ns: "care" })}
        className="flex flex-col gap-3"
      >
        {BOOKING_SLOTS.map((slot) => {
          const selected = selectedId === slot.id;
          const when = `${formatDate(new Date(slot.at))} ${periodLabel(slot.period, t)}`;
          return (
            <Button
              key={slot.id}
              variant={selected ? "primary" : "secondary"}
              aria-pressed={selected}
              data-slot={slot.id}
              onClick={() => {
                setSelectedId(slot.id);
              }}
            >
              <time dateTime={slot.at}>{when}</time>
            </Button>
          );
        })}
      </div>
      {selectedId !== null ? <p role="status">{t("booking.selected", { ns: "care" })}</p> : null}
    </section>
  );
}
