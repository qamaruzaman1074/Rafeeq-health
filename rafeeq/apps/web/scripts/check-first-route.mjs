import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const dist = new URL("../dist/", import.meta.url);
const manifestPath = new URL(".vite/manifest.json", dist);

if (!existsSync(manifestPath)) {
  throw new Error("dist/.vite/manifest.json is missing. Build with manifest enabled.");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const entry = manifest["index.html"];
const landingKey = "src/pages/landing-page.tsx";
const landing = manifest[landingKey];
if (entry === undefined || typeof entry.file !== "string" || landing === undefined) {
  throw new Error("Vite manifest is missing the entry or the landing page chunk");
}

const seen = new Set();
const queue = ["index.html", landingKey];

while (queue.length > 0) {
  const key = queue.pop();
  if (key === undefined || seen.has(key)) {
    continue;
  }
  const meta = manifest[key];
  if (meta === undefined) {
    throw new Error(`Vite manifest is missing ${key}`);
  }
  seen.add(key);
  for (const imported of meta.imports ?? []) {
    queue.push(imported);
  }
}

const forbidden = /clinic|insights|recharts/i;
for (const key of seen) {
  const meta = manifest[key];
  const label = `${key} ${meta.src ?? ""} ${meta.name ?? ""}`;
  if (forbidden.test(label)) {
    throw new Error(`First route bundle includes ${label}`);
  }
}

let gzipBytes = 0;
for (const key of seen) {
  const file = manifest[key].file;
  if (typeof file !== "string" || !file.endsWith(".js")) {
    continue;
  }
  gzipBytes += gzipSync(readFileSync(new URL(file, dist))).length;
}

const limit = 250 * 1024;
if (gzipBytes > limit) {
  throw new Error(`First route JS is ${gzipBytes} bytes gzip, above ${limit}`);
}

const html = readFileSync(new URL("index.html", dist), "utf8");
if (/fonts\.(?:googleapis|gstatic)\.com/.test(html)) {
  throw new Error("Built HTML requests Google Fonts");
}
if (!html.includes('rel="manifest"')) {
  throw new Error("Built HTML is missing the web manifest link");
}

const serviceWorkerPath = new URL("sw.js", dist);
if (!existsSync(serviceWorkerPath)) {
  throw new Error("dist/sw.js is missing");
}
const serviceWorker = readFileSync(serviceWorkerPath, "utf8");
if (!serviceWorker.includes("denylist:[/^\\/api\\//]")) {
  throw new Error("Service worker does not deny navigations under /api");
}
if (/CacheFirst|NetworkFirst|StaleWhileRevalidate/.test(serviceWorker)) {
  throw new Error("Service worker adds a runtime cache");
}
if (serviceWorker.includes("mockServiceWorker.js")) {
  throw new Error("Service worker precaches the mock service worker");
}

const manifestFile = new URL("manifest.webmanifest", dist);
if (!existsSync(manifestFile)) {
  throw new Error("dist/manifest.webmanifest is missing");
}

console.log(`first route JS gzip ${gzipBytes} bytes across ${seen.size} modules`);
