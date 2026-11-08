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
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "2rem",
      "4xl": "2.5rem",
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
