import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

describe("website assistant bundle", () => {
  it("does not ship Gemini API key env names in client chunks", () => {
    const sample = readFileSync(
      join(webRoot, "src/features/website-assistant/api.ts"),
      "utf8",
    );
    expect(sample).not.toContain("GEMINI_API_KEY");
    expect(sample).not.toContain("@google/genai");
  });
});
