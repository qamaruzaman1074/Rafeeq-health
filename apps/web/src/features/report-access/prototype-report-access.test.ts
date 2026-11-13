import { afterEach, describe, expect, it } from "vitest";
import { setAuthenticatedSession, setSessionRole } from "@/app/session";
import {
  createPrototypeReportCode,
  generatePrototypeReportCode,
  getPrototypeReportAccess,
  isValidPrototypeReportCode,
  unlockPrototypeReport,
} from "@/features/report-access/prototype-report-access";
import { sanitizeReportAccessCodeInput } from "@/features/report-access/report-code";

afterEach(() => {
  setSessionRole(null);
});

describe("prototype report access", () => {
  it("generates codes in the accepted format", () => {
    const code = generatePrototypeReportCode();
    expect(code).toMatch(/^[0-9]{6}$/);
    expect(isValidPrototypeReportCode(code)).toBe(true);
    expect(isValidPrototypeReportCode("12345")).toBe(false);
    expect(isValidPrototypeReportCode("1234567")).toBe(false);
    expect(isValidPrototypeReportCode("12AB56")).toBe(false);
    expect(isValidPrototypeReportCode("١٢٣٤٥٦")).toBe(true);
    expect(sanitizeReportAccessCodeInput("٠١-٢٣٤٥٦٧")).toBe("012345");
  });

  it("keeps a report locked until its matching code is entered", () => {
    setAuthenticatedSession("couple", "report-access-user");
    createPrototypeReportCode("012345");

    expect(getPrototypeReportAccess().unlocked).toBe(false);
    expect(unlockPrototypeReport("543210")).toBe(false);
    expect(getPrototypeReportAccess().unlocked).toBe(false);
    expect(unlockPrototypeReport("٠١٢٣٤٥")).toBe(true);
    expect(getPrototypeReportAccess().unlocked).toBe(true);

    createPrototypeReportCode("543210");
    expect(getPrototypeReportAccess().unlocked).toBe(false);
  });

  it("rejects malformed custom codes", () => {
    expect(() => createPrototypeReportCode("invalid")).toThrow(
      "Report access codes must contain exactly 6 digits.",
    );
  });
});
