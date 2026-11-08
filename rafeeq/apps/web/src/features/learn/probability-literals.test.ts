import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

function filesUnder(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    if (statSync(full).isDirectory()) {
      found.push(...filesUnder(full));
      continue;
    }
    found.push(full);
  }
  return found;
}

function isolatedDigits(digits: string): RegExp {
  return new RegExp(`(?:^|\\D)${digits}(?:\\D|$)`);
}

function forbiddenPatterns(): RegExp[] {
  const twentyFive = String.fromCharCode(0x32, 0x35);
  const fifty = String.fromCharCode(0x35, 0x30);
  return [
    new RegExp(String.raw`\d+\s*/\s*\d+`),
    new RegExp(String.raw`\d+\s*%`),
    new RegExp(String.raw`\d+\s+in\s+\d+`, "i"),
    new RegExp(String.raw`\d+\s*في\s*\d+`),
    new RegExp("[\\u0660-\\u0669\\u066A]"),
    isolatedDigits(twentyFive),
    isolatedDigits(fifty),
  ];
}

describe("learn feature probability literals", () => {
  it("keeps kernel numbers out of src/features/learn", () => {
    const root = fileURLToPath(new URL(".", import.meta.url));
    const patterns = forbiddenPatterns();
    const hits: string[] = [];
    for (const file of filesUnder(root)) {
      const text = readFileSync(file, "utf8");
      for (const pattern of patterns) {
        const match = pattern.exec(text);
        if (match !== null) {
          hits.push(`${path.relative(root, file)}: ${match[0]}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
