import { describe, expect, it } from "vitest";
import enCouple from "@/i18n/locales/en/couple.json";
import { demoPartnerFindings, demoReport } from "@/features/demo-report/demo-report";

describe("synthetic demonstration report", () => {
  it("marks the report and every finding as synthetic", () => {
    expect(demoReport.isSynthetic).toBe(true);
    expect([...demoReport.findings, ...demoPartnerFindings].every((f) => f.isSynthetic)).toBe(true);
  });

  it("covers all four result statuses", () => {
    expect(new Set(demoReport.findings.map((finding) => finding.status))).toEqual(
      new Set([
        "carrier_finding",
        "no_variant_identified_in_demo_panel",
        "inconclusive",
        "not_tested",
      ]),
    );
  });

  it("avoids compatibility scores and 'negative' wording in report copy", () => {
    const text = JSON.stringify(enCouple.report).toLowerCase();
    for (const term of [
      "compatible",
      "compatibility",
      "negative",
      "safe marriage",
      "match score",
    ]) {
      expect(text).not.toContain(term);
    }
    expect(enCouple.report.syntheticBanner).toBe("Demo example — not a real genetic test result");
  });
});
