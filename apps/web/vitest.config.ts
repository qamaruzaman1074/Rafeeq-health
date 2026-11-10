import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "node",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.{test,spec}.ts"],
      env: {
        VITE_API_BASE_URL: "http://127.0.0.1:4010",
      },
    },
  }),
);
