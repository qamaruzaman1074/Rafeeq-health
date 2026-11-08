import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

const palette: Record<string, string> = {
  "teal-900": "#0B3F45",
  "teal-700": "#0F5C63",
  "teal-500": "#1F8A8F",
  "teal-100": "#D7EEEE",
  sand50: "#FBF8F2",
  "sand-100": "#F6F1E7",
  "gold-500": "#B8893B",
  "lilac-100": "#ECE8F6",
  "amber-100": "#FBEFD5",
  "green-600": "#2F7D5B",
  "ink-900": "#1B2B2E",
  "ink-600": "#4B5A5D",
  "danger-600": "#B3261E",
};

function channel(hex: string, offset: number): number {
  return Number.parseInt(hex.slice(offset, offset + 2), 16);
}

function linear(value: number): number {
  const unit = value / 255;
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const normalized = hex.toUpperCase();
  return (
    0.2126 * linear(channel(normalized, 1)) +
    0.7152 * linear(channel(normalized, 3)) +
    0.0722 * linear(channel(normalized, 5))
  );
}

function contrast(foreground: string, background: string): number {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function tokenHex(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  const hex = match?.[1];
  if (hex === undefined) {
    throw new Error(`Missing token --${name}`);
  }
  return hex.toUpperCase();
}

const textPairs: Array<[string, string, number]> = [
  ["ink-900", "sand-50", 13.84],
  ["ink-900", "sand-100", 13.03],
  ["ink-900", "teal-100", 12.12],
  ["ink-900", "amber-100", 12.86],
  ["ink-900", "lilac-100", 12.18],
  ["ink-600", "sand-50", 6.79],
  ["ink-600", "sand-100", 6.39],
  ["teal-900", "sand-50", 10.94],
  ["teal-900", "sand-100", 10.3],
  ["teal-900", "teal-100", 9.58],
  ["teal-700", "sand-50", 7.25],
  ["teal-700", "sand-100", 6.83],
  ["teal-700", "teal-100", 6.35],
  ["sand-50", "teal-700", 7.25],
  ["sand-50", "teal-900", 10.94],
  ["sand-50", "danger-600", 6.17],
  ["sand-50", "green-600", 4.71],
  ["sand-50", "ink-600", 6.79],
  ["danger-600", "sand-50", 6.17],
];

const uiPairs: Array<[string, string, number]> = [
  ["teal-500", "sand-50", 3.89],
  ["teal-500", "sand-100", 3.66],
  ["teal-500", "teal-100", 3.41],
  ["teal-500", "amber-100", 3.62],
  ["teal-500", "lilac-100", 3.43],
  ["teal-700", "amber-100", 6.74],
  ["teal-700", "lilac-100", 6.39],
  ["ink-600", "sand-50", 6.79],
  ["green-600", "sand-100", 4.44],
  ["danger-600", "sand-50", 6.17],
];

describe("design tokens", () => {
  it("keeps the planning palette", () => {
    expect(tokenHex("teal-900")).toBe(palette["teal-900"]);
    expect(tokenHex("teal-700")).toBe(palette["teal-700"]);
    expect(tokenHex("teal-500")).toBe(palette["teal-500"]);
    expect(tokenHex("teal-100")).toBe(palette["teal-100"]);
    expect(tokenHex("sand-50")).toBe(palette.sand50);
    expect(tokenHex("sand-100")).toBe(palette["sand-100"]);
    expect(tokenHex("gold-500")).toBe(palette["gold-500"]);
    expect(tokenHex("lilac-100")).toBe(palette["lilac-100"]);
    expect(tokenHex("amber-100")).toBe(palette["amber-100"]);
    expect(tokenHex("green-600")).toBe(palette["green-600"]);
    expect(tokenHex("ink-900")).toBe(palette["ink-900"]);
    expect(tokenHex("ink-600")).toBe(palette["ink-600"]);
    expect(tokenHex("danger-600")).toBe(palette["danger-600"]);
  });

  it("meets 4.5:1 for the text pairs in use", () => {
    for (const [foreground, background, expected] of textPairs) {
      const ratio = contrast(tokenHex(foreground), tokenHex(background));
      expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratio.toFixed(2)), `${foreground} on ${background}`).toBe(expected);
    }
  });

  it("meets 3:1 for the UI pairs in use", () => {
    for (const [foreground, background, expected] of uiPairs) {
      const ratio = contrast(tokenHex(foreground), tokenHex(background));
      expect(ratio, `${foreground} on ${background}`).toBeGreaterThanOrEqual(3);
      expect(Number(ratio.toFixed(2)), `${foreground} on ${background}`).toBe(expected);
    }
  });

  it("keeps gold and teal-500 off text-bearing fills", () => {
    expect(contrast(tokenHex("gold-500"), tokenHex("sand-50"))).toBeLessThan(3);
    expect(contrast(tokenHex("sand-50"), tokenHex("teal-500"))).toBeLessThan(4.5);
    expect(contrast(tokenHex("ink-900"), tokenHex("danger-600"))).toBeLessThan(4.5);
  });

  it("switches the sans family with the document language", () => {
    expect(css).toMatch(
      /html\[lang="en"\],\s*html\[lang="en"\] body,\s*\[lang="en"\]:not\(html\)\s*\{\s*font-family:\s*"IBM Plex Sans",\s*"IBM Plex Sans Arabic",\s*sans-serif;/,
    );
    expect(css).toMatch(
      /html\[lang="ar"\],\s*html\[lang="ar"\] body,\s*\[lang="ar"\]:not\(html\)\s*\{\s*font-family:\s*"IBM Plex Sans Arabic",\s*"IBM Plex Sans",\s*sans-serif;/,
    );
  });

  it("self-hosts both families with font-display swap", () => {
    const faces = css.match(/@font-face\s*{[^}]+}/g) ?? [];
    expect(faces).toHaveLength(8);
    for (const face of faces) {
      expect(face).toContain("font-display: swap");
      expect(face).toContain('format("woff2")');
    }
    expect(css).toContain('font-family: "IBM Plex Sans"');
    expect(css).toContain('font-family: "IBM Plex Sans Arabic"');
    expect(css).not.toContain("fonts.googleapis.com");
    expect(css).not.toContain("fonts.gstatic.com");
  });

  it("draws a 3px teal focus ring and respects reduced motion", () => {
    expect(css).toContain("outline: 3px solid var(--teal-500);");
    expect(css).toContain("outline-offset: 2px;");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("animation-duration: 0.01ms !important;");
    expect(css).toContain("transition-duration: 0.01ms !important;");
  });

  it("ships woff2 files for the hosted weights", () => {
    const files = readdirSync(new URL("./fonts", import.meta.url));
    const expected = [
      "IBMPlexSans-Regular.woff2",
      "IBMPlexSans-Medium.woff2",
      "IBMPlexSans-SemiBold.woff2",
      "IBMPlexSans-Bold.woff2",
      "IBMPlexSansArabic-Regular.woff2",
      "IBMPlexSansArabic-Medium.woff2",
      "IBMPlexSansArabic-SemiBold.woff2",
      "IBMPlexSansArabic-Bold.woff2",
      "OFL.txt",
    ];
    for (const name of expected) {
      expect(files).toContain(name);
      if (name.endsWith(".woff2")) {
        expect(css).toContain(name);
        const bytes = readFileSync(new URL(`./fonts/${name}`, import.meta.url));
        expect(bytes.subarray(0, 4).toString("ascii")).toBe("wOF2");
      }
    }
  });
});
