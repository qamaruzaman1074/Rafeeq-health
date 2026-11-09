import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const FIRST_ROUTE_FONTS = [
  "IBMPlexSans-Regular.woff2",
  "IBMPlexSans-Medium.woff2",
  "IBMPlexSans-SemiBold.woff2",
] as const;

function fontPreloadPlugin(): Plugin {
  return {
    name: "rafeeq-font-preload",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const hrefFor = (file: string): string => {
          const bundle = ctx.bundle;
          if (bundle === undefined) {
            return `/src/styles/fonts/${file}`;
          }
          for (const item of Object.values(bundle)) {
            if (item.type !== "asset") {
              continue;
            }
            const originals = item.originalFileNames;
            const names = item.names;
            const stem = file.replace(/\.woff2$/, "");
            const matched =
              originals.some((name) => name.endsWith(file)) ||
              names.includes(file) ||
              item.fileName.includes(stem);
            if (matched) {
              return `/${item.fileName}`;
            }
          }
          throw new Error(`First-route font was not emitted: ${file}`);
        };
        const list = FIRST_ROUTE_FONTS.map(hrefFor);
        const script = `<script>(function(){var fonts=${JSON.stringify(list)};for(var i=0;i<fonts.length;i+=1){var link=document.createElement("link");link.rel="preload";link.as="font";link.type="font/woff2";link.crossOrigin="anonymous";link.href=fonts[i];document.head.appendChild(link);}})();</script>`;
        const marker = "<!-- rafeeq-font-preload -->";
        if (!html.includes(marker)) {
          throw new Error("index.html is missing the font preload marker");
        }
        return html.replace(marker, script);
      },
    },
  };
}

const demoMocks = process.env.VITE_USE_MOCKS !== "false";

export default defineConfig({
  define: {
    "import.meta.env.VITE_USE_MOCKS": JSON.stringify(
      process.env.VITE_USE_MOCKS === undefined ? "true" : process.env.VITE_USE_MOCKS,
    ),
  },
  plugins: [
    react(),
    ...(demoMocks
      ? []
      : [
          VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.svg", "icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Rafeeq",
        short_name: "Rafeeq",
        description:
          "Understand your genetic result - in your language, at your pace, with a counsellor one tap away.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#F8F6F0",
        theme_color: "#103D40",
        lang: "en",
        dir: "ltr",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        ],
      },
            workbox: {
              navigateFallback: "index.html",
              navigateFallbackDenylist: [/^\/api\//],
              globPatterns: ["**/*.{js,css,html,svg,png,woff2,webmanifest}"],
              globIgnores: ["**/mockServiceWorker.js"],
              runtimeCaching: [],
            },
          }),
        ]),
    fontPreloadPlugin(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    manifest: true,
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      "/api/assistant": {
        target: `http://127.0.0.1:${process.env.ASSISTANT_DEV_PORT ?? "8787"}`,
        changeOrigin: true,
        bypass: (req) => {
          if (process.env.VITE_USE_MOCKS !== "false") {
            return req.url;
          }
          return undefined;
        },
      },
    },
  },
});
