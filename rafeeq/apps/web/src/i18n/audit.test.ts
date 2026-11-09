import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NAMESPACES } from "@/i18n/namespaces";
import { REQUIRED_NAMESPACES, auditSource, auditWeb } from "../../scripts/check-i18n.mjs";

const webRoot = fileURLToPath(new URL("../..", import.meta.url));

function writeLocales(root: string, catalogs: { en: Record<string, unknown> }) {
  const directory = path.join(root, "src", "i18n", "locales", "en");
  mkdirSync(directory, { recursive: true });
  for (const namespace of NAMESPACES) {
    const catalog = catalogs.en[namespace] ?? {};
    writeFileSync(path.join(directory, `${namespace}.json`), JSON.stringify(catalog));
  }
}

describe("check-i18n", () => {
  it("uses the same namespace list as the app", () => {
    expect([...REQUIRED_NAMESPACES]).toEqual([...NAMESPACES]);
  });

  it("passes on the current tree", () => {
    expect(auditWeb(webRoot)).toEqual([]);
  });

  it("fails on a hard-coded JSX string", () => {
    const catalogs = {
      en: { common: { hello: "Hello" } },
    };
    const violations = auditSource(
      `export function Sample(){ return <p>Hello</p>; }`,
      "src/Sample.tsx",
      catalogs,
    );
    expect(violations.some((item) => item.message === "Hard-coded JSX string")).toBe(true);
  });

  it("fails when a translation key is missing from English", () => {
    const catalogs = {
      en: { common: { hello: "Hello" } },
    };
    const used = auditSource(
      `export function Sample(){ const t = (key: string) => key; return <p>{t("missing.key")}</p>; }`,
      "src/Sample.tsx",
      catalogs,
    );
    expect(used.some((item) => item.message.includes("missing.key"))).toBe(true);
  });

  it("exits non-zero for a fixture tree and zero for this app", () => {
    expect(() =>
      execFileSync("node", ["scripts/check-i18n.mjs"], { cwd: webRoot, stdio: "pipe" }),
    ).not.toThrow();

    const fixture = mkdtempSync(path.join(tmpdir(), "rafeeq-i18n-"));
    try {
      writeLocales(fixture, { en: { common: { hello: "Hello" } } });
      writeFileSync(
        path.join(fixture, "src", "Sample.tsx"),
        `export function Sample(){ return <p>Hello</p>; }`,
      );
      try {
        execFileSync("node", ["scripts/check-i18n.mjs", fixture], { cwd: webRoot, stdio: "pipe" });
        throw new Error("fixture tree should fail");
      } catch (error) {
        if (error instanceof Error && error.message === "fixture tree should fail") {
          throw error;
        }
        const stderr =
          typeof error === "object" && error !== null && "stderr" in error
            ? String(error.stderr)
            : "";
        expect(stderr).toContain("Hard-coded JSX string");
      }
    } finally {
      rmSync(fixture, { recursive: true, force: true });
    }
  });
});
