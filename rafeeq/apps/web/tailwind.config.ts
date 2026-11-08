import type { Config } from "tailwindcss";

const config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      teal: {
        900: "var(--teal-900)",
        700: "var(--teal-700)",
        500: "var(--teal-500)",
        100: "var(--teal-100)",
      },
      sand: {
        50: "var(--sand-50)",
        100: "var(--sand-100)",
      },
      gold: {
        500: "var(--gold-500)",
      },
      lilac: {
        100: "var(--lilac-100)",
      },
      amber: {
        100: "var(--amber-100)",
      },
      green: {
        600: "var(--green-600)",
      },
      ink: {
        900: "var(--ink-900)",
        600: "var(--ink-600)",
      },
      danger: {
        600: "var(--danger-600)",
      },
      border: "var(--border)",
      "border-subtle": "var(--border-subtle)",
      input: "var(--input)",
      ring: "var(--ring)",
      background: "var(--background)",
      foreground: "var(--foreground)",
      primary: {
        DEFAULT: "var(--primary)",
        foreground: "var(--primary-foreground)",
      },
      secondary: {
        DEFAULT: "var(--secondary)",
        foreground: "var(--secondary-foreground)",
      },
      destructive: {
        DEFAULT: "var(--destructive)",
        foreground: "var(--destructive-foreground)",
      },
      muted: {
        DEFAULT: "var(--muted)",
        foreground: "var(--muted-foreground)",
      },
      accent: {
        DEFAULT: "var(--accent)",
        foreground: "var(--accent-foreground)",
      },
      popover: {
        DEFAULT: "var(--popover)",
        foreground: "var(--popover-foreground)",
      },
      card: {
        DEFAULT: "var(--card)",
        foreground: "var(--card-foreground)",
      },
    },
    fontFamily: {
      sans: ['"IBM Plex Sans"', '"IBM Plex Sans Arabic"', "sans-serif"],
    },
    fontSize: {
      sm: ["0.875rem", { lineHeight: "1.45" }],
      base: ["1rem", { lineHeight: "1.55" }],
      lg: ["1.125rem", { lineHeight: "1.5" }],
      xl: ["1.25rem", { lineHeight: "1.4" }],
      "2xl": ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.02em" }],
      "3xl": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
      "4xl": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
    },
    spacing: {
      px: "1px",
      0: "0px",
      0.5: "0.125rem",
      1: "0.25rem",
      1.5: "0.375rem",
      2: "0.5rem",
      2.5: "0.625rem",
      3: "0.75rem",
      3.5: "0.875rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      9: "2.25rem",
      10: "2.5rem",
      11: "2.75rem",
      12: "3rem",
      14: "3.5rem",
      16: "4rem",
      18: "4.5rem",
      20: "5rem",
      24: "6rem",
      28: "7rem",
      32: "8rem",
      section: "2.5rem",
      "section-lg": "4rem",
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        surface: "var(--shadow-sm)",
        "surface-md": "var(--shadow-md)",
        "surface-lg": "var(--shadow-lg)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
