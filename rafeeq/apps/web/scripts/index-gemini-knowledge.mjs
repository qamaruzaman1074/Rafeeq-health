/**
 * Creates (once) a Gemini File Search store and uploads knowledge/sources/*.md
 * Env: GEMINI_API_KEY, optional GEMINI_FILE_SEARCH_STORE, GEMINI_MODEL (unused here)
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcesDir = join(root, "knowledge", "sources");
const statePath = join(root, "knowledge", ".upload-state.json");

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

async function waitForOperation(ai, operation) {
  let current = operation;
  while (!current.done) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    current = await ai.operations.get({ operation: current });
  }
  return current;
}

function loadState() {
  if (!existsSync(statePath)) {
    return { fileSearchStoreName: null, files: {} };
  }
  return JSON.parse(readFileSync(statePath, "utf8"));
}

function saveState(state) {
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required");
  }
  if (!existsSync(sourcesDir)) {
    throw new Error("Run node scripts/build-knowledge.mjs first");
  }

  const ai = new GoogleGenAI({ apiKey });
  const state = loadState();
  let storeName = process.env.GEMINI_FILE_SEARCH_STORE || state.fileSearchStoreName;

  if (!storeName) {
    const store = await ai.fileSearchStores.create({
      config: {
        displayName: "rafeeq-website-knowledge",
        embeddingModel: "gemini-embedding-2-preview-05-20",
      },
    });
    storeName = store.name;
    state.fileSearchStoreName = storeName;
    saveState(state);
    console.log("Created File Search store:", storeName);
    console.log("Set GEMINI_FILE_SEARCH_STORE=" + storeName);
  }

  const mdFiles = readdirSync(sourcesDir).filter((name) => name.endsWith(".md"));
  let uploaded = 0;
  let skipped = 0;
  const errors = [];

  for (const name of mdFiles) {
    const filePath = join(sourcesDir, name);
    const hash = sha256File(filePath);
    if (state.files[name]?.sha256 === hash) {
      skipped += 1;
      continue;
    }

    try {
      let operation = await ai.fileSearchStores.uploadToFileSearchStore({
        file: filePath,
        fileSearchStoreName: storeName,
        config: {
          displayName: name,
          mimeType: "text/markdown",
        },
      });
      operation = await waitForOperation(ai, operation);
      state.files[name] = { sha256: hash, updatedAt: new Date().toISOString() };
      saveState(state);
      uploaded += 1;
      console.log("Indexed:", name);
    } catch (error) {
      errors.push({ name, message: error instanceof Error ? error.message : String(error) });
      console.error("Failed:", name, errors.at(-1)?.message);
    }
  }

  console.log(`Indexing done. uploaded=${uploaded} skipped=${skipped} errors=${errors.length}`);
  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
