import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const BANNED = [
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
    found.push(full);
  }
  return found;
}

describe("result wording", () => {
  it("keeps banned terms out of result copy", () => {
    const root = fileURLToPath(new URL(".", import.meta.url));
    const extra = [fileURLToPath(new URL("../../i18n/locales/en/result.json", import.meta.url))];
    const hits: string[] = [];
    for (const file of [...filesUnder(root), ...extra]) {
      const text = readFileSync(file, "utf8");
      for (const pattern of BANNED) {
        if (pattern.test(text)) {
          hits.push(`${path.relative(root, file)}: ${pattern}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
