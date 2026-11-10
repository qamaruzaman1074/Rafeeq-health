import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const BANNED = [
  /risk level/i,
  /due-by/i,
  /due_by/,
  /dueBy/,
  /due by/i,
  /\bT[1-4]\b/,
  /T1_info/,
  /T2_counsel_routine/,
  /T3_counsel_priority/,
  /T4_urgent_human/,
  /defective/i,
  /abnormal/i,
  /mutant/i,
  /bad genes/i,
  /risky couple/i,
  /incompatible/i,
  /genetic disease couple/i,
  /high-risk/i,
  /dangerous/i,
  /you must/i,
  /you should not marry/i,
];

function filesUnder(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    if (statSync(full).isDirectory()) {
      found.push(...filesUnder(full));
      continue;
    }
    if (/\.(?:test|spec)\.(?:ts|tsx)$/.test(entry)) {
      continue;
    }
    if (/\.(?:ts|tsx)$/.test(entry)) {
      found.push(full);
    }
  }
  return found;
}

function catalogStrings(file: string): string[] {
  const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));
  const found: string[] = [];
  function walk(value: unknown): void {
    if (typeof value === "string") {
      found.push(value);
      return;
    }
    if (typeof value === "object" && value !== null) {
      for (const child of Object.values(value)) {
        walk(child);
      }
    }
  }
  walk(parsed);
  return found;
}

describe("care wording", () => {
  it("keeps tier, due-by, and risk level out of the care UI and care strings", () => {
    const featureRoot = fileURLToPath(new URL(".", import.meta.url));
    const sources = filesUnder(featureRoot).map((file) => ({
      file: path.relative(featureRoot, file),
      text: readFileSync(file, "utf8"),
    }));
    const english = catalogStrings(
      fileURLToPath(new URL("../../i18n/locales/en/care.json", import.meta.url)),
    ).join("\n");
    const hits: string[] = [];
    for (const source of sources) {
      for (const pattern of BANNED) {
        const match = pattern.exec(source.text);
        if (match !== null) {
          hits.push(`${source.file}: ${match[0]}`);
        }
      }
    }
    for (const pattern of BANNED) {
      const englishHit = pattern.exec(english);
      if (englishHit !== null) {
        hits.push(`en/care.json: ${englishHit[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
