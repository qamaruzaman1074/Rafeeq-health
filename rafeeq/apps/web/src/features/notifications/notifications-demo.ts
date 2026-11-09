/** Synthetic notifications. Previews never contain genetic findings. */
export const DEMO_NOTIFICATION_KEYS = [
  "reportReady",
  "inconclusiveExplained",
  "invitePending",
  "consentUpdated",
  "referralChanged",
] as const;

export type DemoNotificationKey = (typeof DEMO_NOTIFICATION_KEYS)[number];

export type DemoNotification = {
  key: DemoNotificationKey;
  href: string;
  read: boolean;
};

const hrefs: Record<DemoNotificationKey, string> = {
  reportReady: "/app/report",
  inconclusiveExplained: "/app/report",
  invitePending: "/app/partner",
  consentUpdated: "/app/privacy",
  referralChanged: "/app/care",
};

export function initialNotifications(): DemoNotification[] {
  return DEMO_NOTIFICATION_KEYS.map((key) => ({ key, href: hrefs[key], read: false }));
}

export function markRead(list: DemoNotification[], key: DemoNotificationKey): DemoNotification[] {
  return list.map((item) => (item.key === key ? { ...item, read: true } : item));
}

export function markAllRead(list: DemoNotification[]): DemoNotification[] {
  return list.map((item) => ({ ...item, read: true }));
}

export function unreadCount(list: DemoNotification[]): number {
  return list.filter((item) => !item.read).length;
}
