#!/usr/bin/env node
/**
 * Fail when a term from rafeeq/content/banned_terms.json appears in
 * rafeeq/apps/web locale JSON. Arabic terms stay empty until they are listed.
 * OPEN_QUESTION: MASTER.md Section 10 names English terms only.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const termsFile = path.join(root, "content", "banned_terms.json");
const localesRoot = path.join(root, "apps", "web", "src", "i18n", "locales");

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function termsFrom(file) {
  const parsed = readJson(file);
  const found = [];
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return found;
  }
  for (const key of ["en", "ar"]) {
    const list = parsed[key];
    if (!Array.isArray(list)) {
      continue;
    }
    for (const term of list) {
      if (typeof term === "string" && term.trim().length > 0) {
        found.push(term.trim());
      }
    }
  }
  return found;
}

function walk(directory, files) {
  for (const name of readdirSync(directory)) {
    const full = path.join(directory, name);
    if (statSync(full).isDirectory()) {
      walk(full, files);
      continue;
    }
    if (name.endsWith(".json")) {
      files.push(full);
    }
  }
}

function stringsIn(value, found) {
  if (typeof value === "string") {
    found.push(value);
    return;
  }
  if (typeof value !== "object" || value === null) {
    return;
  }
  for (const child of Object.values(value)) {
    stringsIn(child, found);
  }
}

function includesTerm(text, term) {
  return text.toLocaleLowerCase("en").includes(term.toLocaleLowerCase("en"));
}

const terms = termsFrom(termsFile);
const files = [];
walk(localesRoot, files);
const hits = [];

for (const file of files) {
  const values = [];
  stringsIn(readJson(file), values);
  for (const text of values) {
    for (const term of terms) {
      if (includesTerm(text, term)) {
        hits.push(`${path.relative(root, file)}: ${JSON.stringify(term)}`);
      }
    }
  }
}

if (hits.length > 0) {
  process.stderr.write(`Banned terms in web locales:\n${hits.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(
  `Banned-term check passed (${terms.length} terms, ${files.length} files).\n`,
);
