import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = new URL("..", import.meta.url);

function sourceFiles(directory: URL): string[] {
  const folder = directory.pathname;
  const found: string[] = [];
  for (const entry of readdirSync(folder)) {
    const path = join(folder, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (entry === "fonts") {
        continue;
      }
      found.push(...sourceFiles(new URL(`${entry}/`, directory)));
      continue;
    }
    if (/\.(?:ts|tsx|css)$/.test(entry) && !entry.endsWith(".test.ts")) {
      found.push(path);
    }
  }
  return found;
}

const physical =
  /\b(?:left|right|ml|mr|mx|pl|pr|px)-|\b(?:text-left|text-right|float-left|float-right|border-l|border-r|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br|inset-x|translate-x|space-x)\b|(?:margin|padding)-(?:left|right)\s*:|\b(?:left|right)\s*:/;

describe("design system constraints", () => {
  it("uses logical properties and does not request Google Fonts", () => {
    const failures: string[] = [];
    for (const file of sourceFiles(srcRoot)) {
      const text = readFileSync(file, "utf8");
      if (physical.test(text) || /fonts\.(?:googleapis|gstatic)\.com/.test(text)) {
        failures.push(relative(srcRoot.pathname, file));
      }
    }
    expect(failures).toEqual([]);
  });

  it("keeps danger-600 on error and delete surfaces", () => {
    const allowed = new Set([
      "components/ui/badge.tsx",
      "components/ui/button.tsx",
      "components/ui/toast.tsx",
      "pages/dev/styleguide-page.tsx",
      "styles/tokens.css",
    ]);
    const failures: string[] = [];
    for (const file of sourceFiles(srcRoot)) {
      const text = readFileSync(file, "utf8");
      const rel = relative(srcRoot.pathname, file);
      if (/danger-600|bg-red-|text-red-|#b3261e/i.test(text) && !allowed.has(rel)) {
        failures.push(rel);
      }
    }
    expect(failures).toEqual([]);
  });

  it("registers the styleguide route", () => {
    const router = readFileSync(new URL("../app/router.tsx", import.meta.url), "utf8");
    expect(router).toContain('path: "/dev/styleguide"');
  });
});
