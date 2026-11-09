import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcRoot = fileURLToPath(new URL("..", import.meta.url));

function sourceFiles(directory: string): string[] {
  const folder = directory;
  const found: string[] = [];
  for (const entry of readdirSync(folder)) {
    const path = join(folder, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (entry === "fonts") {
        continue;
      }
      found.push(...sourceFiles(join(folder, entry)));
      continue;
    }
    if (/\.(?:ts|tsx|css)$/.test(entry) && !entry.endsWith(".test.ts")) {
      found.push(path);
    }
  }
  return found;
}

const physical =
  /\b(?:left|right)\b(?!\w)|\b(?:ml-|mr-|pl-|pr-)|\b(?:text-left|text-right|float-left|float-right|border-l-|border-r-|rounded-l-|rounded-r-|rounded-tl-|rounded-tr-|rounded-bl-|rounded-br-|inset-x-|translate-x-|space-x-)\b|(?:margin|padding)-(?:left|right)\s*:|\b(?:left|right)\s*:/;

function relativeSrc(file: string): string {
  return relative(srcRoot, file).split(sep).join("/");
}

describe("design system constraints", () => {
  it("uses logical properties and does not request Google Fonts", () => {
    const failures: string[] = [];
    for (const file of sourceFiles(srcRoot)) {
      const text = readFileSync(file, "utf8");
      if (physical.test(text) || /fonts\.(?:googleapis|gstatic)\.com/.test(text)) {
        failures.push(relativeSrc(file));
      }
    }
    expect(failures).toEqual([]);
  });

  it("keeps danger-600 on error and delete surfaces", () => {
    const allowed = new Set([
      "components/error-state.tsx",
      "components/ui/badge.tsx",
      "components/ui/button.tsx",
      "components/ui/toast.tsx",
      "pages/dev/styleguide-page.tsx",
      "styles/tokens.css",
    ]);
    const failures: string[] = [];
    for (const file of sourceFiles(srcRoot)) {
      const text = readFileSync(file, "utf8");
      const rel = relativeSrc(file);
      if (/danger-600|bg-red-|text-red-|#b3261e/i.test(text) && !allowed.has(rel)) {
        failures.push(rel);
      }
    }
    expect(failures).toEqual([]);
  });

  it("registers the styleguide route", () => {
    const routes = readFileSync(new URL("../app/routes.tsx", import.meta.url), "utf8");
    expect(routes).toContain('path: "/dev/styleguide"');
  });
});
