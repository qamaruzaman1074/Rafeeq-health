import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { EmptyState } from "@/components/empty-state";
import { AppPageLayout } from "@/components/layout/app-page-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  initialNotifications,
  markAllRead,
  markRead,
  unreadCount,
  type DemoNotification,
} from "@/features/notifications/notifications-demo";
import { useSessionState } from "@/lib/use-session-state";

export function Component() {
  const { t } = useTranslation();
  const [items, setItems] = useSessionState<DemoNotification[]>(
    "rafeeq.demo.notifications",
    initialNotifications,
  );
  const unread = unreadCount(items);

  return (
    <AppPageLayout>
      <PageHeader
        title={t("notifications.title", { ns: "couple" })}
        description={t("notifications.intro", { ns: "couple" })}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-base font-medium text-teal-900">
          {t("notifications.unread", { ns: "couple", count: unread })}
        </p>
        <Button
          variant="secondary"
          disabled={unread === 0}
          onClick={() => setItems((current) => markAllRead(current))}
        >
          {t("notifications.markAllRead", { ns: "couple" })}
        </Button>
      </div>
      {unread === 0 ? (
        <EmptyState
          title={t("notifications.empty", { ns: "couple" })}
          body={t("notifications.emptyBody", { ns: "couple" })}
        />
      ) : null}
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.key}
            data-read={item.read}
            className={
              item.read
                ? "flex flex-col gap-3 rounded-xl border border-border-subtle bg-card p-4 opacity-80 sm:flex-row sm:items-center sm:justify-between"
                : "flex flex-col gap-3 rounded-xl border border-teal-700/40 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
            }
          >
            <div className="flex items-start gap-3">
              <Badge variant={item.read ? "neutral" : "conversation"}>
                {item.read
                  ? t("notifications.read", { ns: "couple" })
                  : t("notifications.new", { ns: "couple" })}
              </Badge>
              <p className="text-base text-ink-900">
                {t(`notifications.items.${item.key}`, { ns: "couple" })}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button asChild variant="secondary">
                <Link
                  to={item.href}
                  onClick={() => setItems((current) => markRead(current, item.key))}
                >
                  {t("notifications.open", { ns: "couple" })}
                </Link>
              </Button>
              {item.read ? null : (
                <Button
                  variant="ghost"
                  onClick={() => setItems((current) => markRead(current, item.key))}
                >
                  {t("notifications.markRead", { ns: "couple" })}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Button variant="ghost" className="w-fit" onClick={() => setItems(initialNotifications())}>
        {t("notifications.restore", { ns: "couple" })}
      </Button>
    </AppPageLayout>
  );
}
