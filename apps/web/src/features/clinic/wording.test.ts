import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const BANNED = [
  /risk level/i,
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

describe("clinic wording", () => {
  it("does not label tier as a risk level and keeps banned terms out", () => {
    const featureRoot = fileURLToPath(new URL(".", import.meta.url));
    const sources = [
      ...filesUnder(featureRoot).map((file) => ({
        file: path.relative(featureRoot, file),
        text: readFileSync(file, "utf8"),
      })),
      {
        file: "en/clinic.json",
        text: readFileSync(
          fileURLToPath(new URL("../../i18n/locales/en/clinic.json", import.meta.url)),
          "utf8",
        ),
      },
    ];
    const hits: string[] = [];
    for (const source of sources) {
      for (const pattern of BANNED) {
        const match = pattern.exec(source.text);
        if (match !== null) {
          hits.push(`${source.file}: ${match[0]}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
