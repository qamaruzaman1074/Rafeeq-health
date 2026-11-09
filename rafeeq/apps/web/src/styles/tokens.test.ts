import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

const palette: Record<string, string> = {
  "teal-900": "#103D40",
  "teal-700": "#237A73",
  "teal-500": "#2E9088",
  "teal-100": "#D9EFE8",
  sand50: "#F8F6F0",
  "sand-100": "#F5F1EB",
  "gold-500": "#D5A75A",
  "lilac-100": "#ECE8F6",
  "amber-100": "#FBEFD5",
  "green-600": "#2F7D5B",
  "ink-900": "#263638",
  "ink-600": "#676F6E",
  "danger-600": "#B3261E",
};

const darkPalette: Record<string, string> = {
  "teal-900": "#72B8AA",
  "teal-700": "#91CFC0",
  "teal-100": "#284943",
  "sand-50": "#101C1D",
  "gold-500": "#E0B96F",
  "ink-900": "#F2F5F2",
  "ink-600": "#B0BFBB",
  border: "#344A48",
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

function darkTokenHex(name: string): string {
  const block = css.match(/html\[data-theme="dark"\]\s*\{([^}]+)\}/);
  const body = block?.[1];
  if (body === undefined) {
    throw new Error("Missing dark theme block");
  }
  const match = body.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  const hex = match?.[1];
  if (hex === undefined) {
    throw new Error(`Missing dark token --${name}`);
  }
  return hex.toUpperCase();
}

const textPairs: Array<[string, string, number]> = [
  ["ink-900", "sand-50", 11.66],
  ["ink-900", "sand-100", 11.2],
  ["ink-900", "teal-100", 10.47],
  ["ink-900", "amber-100", 11.04],
  ["ink-900", "lilac-100", 10.46],
  ["teal-900", "sand-50", 11.02],
  ["teal-900", "sand-100", 10.58],
  ["teal-900", "teal-100", 9.9],
  ["teal-700", "sand-50", 4.74],
  ["teal-700", "sand-100", 4.55],
  ["sand-50", "teal-700", 4.74],
  ["sand-50", "teal-900", 11.02],
  ["sand-50", "danger-600", 6.05],
  ["sand-50", "green-600", 4.62],
  ["danger-600", "sand-50", 6.05],
];

const uiPairs: Array<[string, string, number]> = [
  ["teal-500", "sand-50", 3.56],
  ["teal-500", "sand-100", 3.42],
  ["teal-500", "teal-100", 3.2],
  ["teal-500", "amber-100", 3.37],
  ["teal-500", "lilac-100", 3.19],
  ["teal-700", "amber-100", 4.49],
  ["teal-700", "lilac-100", 4.25],
  ["green-600", "sand-100", 4.44],
  ["danger-600", "sand-50", 6.05],
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
    expect(tokenHex("border")).toBe("#E5E9E5");
  });

  it("keeps the specified dark palette", () => {
    expect(darkTokenHex("teal-900")).toBe(darkPalette["teal-900"]);
    expect(darkTokenHex("teal-700")).toBe(darkPalette["teal-700"]);
    expect(darkTokenHex("teal-100")).toBe(darkPalette["teal-100"]);
    expect(darkTokenHex("sand-50")).toBe(darkPalette["sand-50"]);
    expect(darkTokenHex("gold-500")).toBe(darkPalette["gold-500"]);
    expect(darkTokenHex("ink-900")).toBe(darkPalette["ink-900"]);
    expect(darkTokenHex("ink-600")).toBe(darkPalette["ink-600"]);
    expect(darkTokenHex("border")).toBe(darkPalette.border);
    expect(darkTokenHex("card")).toBe("#182829");
    expect(darkTokenHex("elevated")).toBe("#203536");
  });

  it("meets 4.5:1 for dark text pairs in use", () => {
    const pairs: Array<[string, string, number]> = [
      ["ink-900", "sand-50", 15.85],
      ["ink-600", "sand-50", 9.14],
      ["teal-900", "sand-50", 7.59],
      ["teal-700", "sand-50", 9.86],
      ["sand-50", "teal-700", 9.86],
      ["sand-50", "teal-900", 7.59],
    ];
    for (const [foreground, background, expected] of pairs) {
      const ratio = contrast(darkTokenHex(foreground), darkTokenHex(background));
      expect(ratio, `dark ${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratio.toFixed(2)), `dark ${foreground} on ${background}`).toBe(expected);
    }
  });

  it("meets 4.5:1 for muted body copy on card surfaces", () => {
    const ratio = contrast(tokenHex("ink-600"), tokenHex("card"));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
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

  it("uses IBM Plex Sans for English and legacy Arabic lang hooks", () => {
    expect(css).toMatch(
      /html\[lang="en"\],\s*html\[lang="en"\] body,\s*\[lang="en"\]:not\(html\),\s*html\[lang="ar"\],\s*html\[lang="ar"\] body,\s*\[lang="ar"\]:not\(html\)\s*\{\s*font-family:\s*"IBM Plex Sans",\s*sans-serif;/,
    );
  });

  it("self-hosts Plex Sans with font-display swap", () => {
    const faces = css.match(/@font-face\s*{[^}]+}/g) ?? [];
    expect(faces).toHaveLength(4);
    for (const face of faces) {
      expect(face).toContain("font-display: swap");
      expect(face).toContain('format("woff2")');
    }
    expect(css).toContain('font-family: "IBM Plex Sans"');
    expect(css).not.toContain("IBMPlexSansArabic");
    expect(css).not.toContain("fonts.googleapis.com");
    expect(css).not.toContain("fonts.gstatic.com");
  });

  it("draws a 3px focus ring and respects reduced motion", () => {
    expect(css).toContain("outline: 3px solid var(--ring);");
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
