import { describe, expect, it } from "vitest";
import enCouple from "@/i18n/locales/en/couple.json";
import {
  initialNotifications,
  markAllRead,
  markRead,
  unreadCount,
} from "@/features/notifications/notifications-demo";

describe("demo notifications", () => {
  it("starts unread and can be marked read one by one or all at once", () => {
    const list = initialNotifications();
    expect(unreadCount(list)).toBe(5);
    expect(unreadCount(markRead(list, "reportReady"))).toBe(4);
    expect(unreadCount(markAllRead(list))).toBe(0);
  });

  it("keeps genetic findings out of notification previews", () => {
    const text = JSON.stringify(enCouple.notifications.items).toLowerCase();
    for (const term of ["carrier", "thalassemia", "sickle", "hbb", "smn1", "cftr", "variant"]) {
      expect(text).not.toContain(term);
    }
  });
});
