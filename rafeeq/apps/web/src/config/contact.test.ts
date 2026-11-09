import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL, CONTACT_PHONES, mailtoHref } from "@/config/contact";

describe("contact details", () => {
  it("uses the main RAFEEQ address for mailto links", () => {
    expect(CONTACT_EMAIL).toBe("help@rafeeq.health");
    expect(mailtoHref()).toBe("mailto:help@rafeeq.health");
    expect(mailtoHref("General question", "Hello there")).toBe(
      "mailto:help@rafeeq.health?subject=General%20question&body=Hello%20there",
    );
  });

  it("marks both UAE numbers as placeholders with dialable tel values", () => {
    expect(CONTACT_PHONES.map((phone) => phone.display)).toEqual([
      "+971 50 000 0000",
      "+971 55 000 0000",
    ]);
    for (const phone of CONTACT_PHONES) {
      expect(phone.placeholder).toBe(true);
      expect(phone.tel).toMatch(/^\+9715\d{8}$/);
    }
  });
});
