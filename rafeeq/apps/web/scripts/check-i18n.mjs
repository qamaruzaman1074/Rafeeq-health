import { createRequire } from "node:module";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

export const REQUIRED_NAMESPACES = [
  "common",
  "landing",
  "result",
  "couple",
  "learn",
  "check",
  "ask",
  "privacy",
  "care",
  "clinic",
  "insights",
  "errors",
];

const COPY_ATTRIBUTES = new Set([
  "aria-label",
  "aria-description",
  "aria-roledescription",
  "aria-placeholder",
  "aria-valuetext",
  "alt",
  "placeholder",
  "title",
  "label",
]);

const KEY_PROPERTIES = new Set(["heading", "label"]);
const KEY_PATTERN = /^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)+$/;

function hasLetters(text) {
  return /\p{L}/u.test(text);
}

function propertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }
  return null;
}

function calleeName(expression) {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }
  if (ts.isPropertyAccessExpression(expression) && ts.isIdentifier(expression.name)) {
    return expression.name.text;
  }
  return null;
}

function position(source, node) {
  const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
  return { line: line + 1, column: character + 1 };
}

function violation(file, source, node, message) {
  const at = position(source, node);
  return { file, line: at.line, column: at.column, message };
}

function leaves(value, prefix, found) {
  if (typeof value === "string") {
    if (prefix.length > 0) {
      found.add(prefix);
    }
    return;
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const next = prefix.length > 0 ? `${prefix}.${key}` : key;
    leaves(child, next, found);
  }
}

function hasKey(catalog, dotted) {
  const parts = dotted.split(".");
  let current = catalog;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return false;
    }
    current = current[part];
  }
  return typeof current === "string";
}

function namespaceFromCall(node) {
  const option = node.arguments[1];
  if (option === undefined || !ts.isObjectLiteralExpression(option)) {
    return "common";
  }
  for (const property of option.properties) {
    if (!ts.isPropertyAssignment(property) || propertyName(property.name) !== "ns") {
      continue;
    }
    if (ts.isStringLiteral(property.initializer)) {
      return property.initializer.text;
    }
  }
  return "common";
}

function literalText(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return null;
}

function isJsxChild(node) {
  const parent = node.parent;
  if (parent === undefined || !ts.isJsxExpression(parent)) {
    return false;
  }
  const grand = parent.parent;
  return grand !== undefined && (ts.isJsxElement(grand) || ts.isJsxFragment(grand));
}

function templateLetters(node) {
  if (ts.isNoSubstitutionTemplateLiteral(node)) {
    return hasLetters(node.text);
  }
  if (!ts.isTemplateExpression(node)) {
    return false;
  }
  if (hasLetters(node.head.text)) {
    return true;
  }
  return node.templateSpans.some((span) => hasLetters(span.literal.text));
}

export function loadCatalogs(localesDir) {
  const catalogs = { en: {}, ar: {} };
  for (const locale of ["en", "ar"]) {
    const directory = path.join(localesDir, locale);
    const files = readdirSync(directory).filter((name) => name.endsWith(".json"));
    for (const file of files) {
      const namespace = file.slice(0, -".json".length);
      catalogs[locale][namespace] = JSON.parse(readFileSync(path.join(directory, file), "utf8"));
    }
  }
  return catalogs;
}

export function diffCatalogs(catalogs) {
  const violations = [];
  const english = new Set(Object.keys(catalogs.en));
  const arabic = new Set(Object.keys(catalogs.ar));
  const namespaces = [...new Set([...REQUIRED_NAMESPACES, ...english, ...arabic])].sort();

  for (const namespace of namespaces) {
    if (!english.has(namespace) || !arabic.has(namespace)) {
      violations.push({
        file: `src/i18n/locales/${english.has(namespace) ? "ar" : "en"}/${namespace}.json`,
        line: 1,
        column: 1,
        message: `Missing locale file for namespace "${namespace}"`,
      });
      continue;
    }
    const enLeaves = new Set();
    const arLeaves = new Set();
    leaves(catalogs.en[namespace], "", enLeaves);
    leaves(catalogs.ar[namespace], "", arLeaves);
    for (const key of enLeaves) {
      if (!arLeaves.has(key)) {
        violations.push({
          file: `src/i18n/locales/ar/${namespace}.json`,
          line: 1,
          column: 1,
          message: `Missing i18n key "${key}" in ar/${namespace}.json`,
        });
      }
    }
    for (const key of arLeaves) {
      if (!enLeaves.has(key)) {
        violations.push({
          file: `src/i18n/locales/en/${namespace}.json`,
          line: 1,
          column: 1,
          message: `Missing i18n key "${key}" in en/${namespace}.json`,
        });
      }
    }
  }
  return violations;
}

function knownKey(catalogs, dotted) {
  return ["en", "ar"].every((locale) =>
    Object.values(catalogs[locale]).some((catalog) => hasKey(catalog, dotted)),
  );
}

export function auditSource(text, file, catalogs) {
  const scriptKind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind);
  const violations = [];

  function visit(node) {
    if (ts.isJsxText(node) && hasLetters(node.getText(source))) {
      violations.push(violation(file, source, node, "Hard-coded JSX string"));
    }

    if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
      isJsxChild(node) &&
      hasLetters(node.text)
    ) {
      violations.push(violation(file, source, node, "Hard-coded JSX string"));
    }

    if (ts.isTemplateExpression(node) && isJsxChild(node) && templateLetters(node)) {
      violations.push(violation(file, source, node, "Hard-coded JSX string"));
    }

    if (ts.isJsxAttribute(node)) {
      const name = propertyName(node.name);
      const initializer = node.initializer;
      const literal =
        initializer !== undefined && ts.isJsxExpression(initializer)
          ? initializer.expression
          : initializer;
      const textValue = literal === undefined ? null : literalText(literal);
      if (name !== null && textValue !== null && hasLetters(textValue)) {
        if (COPY_ATTRIBUTES.has(name) && !knownKey(catalogs, textValue)) {
          violations.push(violation(file, source, node, "Hard-coded JSX string"));
        }
        if (
          KEY_PROPERTIES.has(name) &&
          KEY_PATTERN.test(textValue) &&
          !knownKey(catalogs, textValue)
        ) {
          violations.push(
            violation(file, source, node, `Missing i18n key "${textValue}" in en and ar`),
          );
        }
      }
    }

    if (ts.isPropertyAssignment(node)) {
      const name = propertyName(node.name);
      if (
        name !== null &&
        KEY_PROPERTIES.has(name) &&
        ts.isStringLiteral(node.initializer) &&
        KEY_PATTERN.test(node.initializer.text) &&
        !knownKey(catalogs, node.initializer.text)
      ) {
        violations.push(
          violation(
            file,
            source,
            node.initializer,
            `Missing i18n key "${node.initializer.text}" in en and ar`,
          ),
        );
      }
    }

    if (ts.isCallExpression(node) && calleeName(node.expression) === "t") {
      const first = node.arguments[0];
      if (first !== undefined && ts.isStringLiteral(first)) {
        const namespace = namespaceFromCall(node);
        const key = first.text;
        for (const locale of ["en", "ar"]) {
          const catalog = catalogs[locale][namespace];
          if (catalog === undefined || !hasKey(catalog, key)) {
            violations.push(
              violation(
                file,
                source,
                first,
                `Missing i18n key "${key}" in ${locale}/${namespace}.json`,
              ),
            );
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return violations;
}

function sourceFiles(directory) {
  const found = [];
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "fonts" || entry === "test") {
        continue;
      }
      found.push(...sourceFiles(full));
      continue;
    }
    if (
      entry.endsWith(".d.ts") ||
      !/\.(?:ts|tsx)$/.test(entry) ||
      /\.(?:test|spec)\.(?:ts|tsx)$/.test(entry)
    ) {
      continue;
    }
    found.push(full);
  }
  return found;
}

export function auditWeb(webRoot) {
  const srcDir = path.join(webRoot, "src");
  const catalogs = loadCatalogs(path.join(srcDir, "i18n", "locales"));
  const violations = diffCatalogs(catalogs);
  for (const file of sourceFiles(srcDir)) {
    const text = readFileSync(file, "utf8");
    violations.push(...auditSource(text, path.relative(webRoot, file), catalogs));
  }
  return violations;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (entry === undefined) {
    return false;
  }
  return import.meta.url === pathToFileURL(entry).href;
}

if (isDirectRun()) {
  const root = process.argv[2] ?? fileURLToPath(new URL("..", import.meta.url));
  const violations = auditWeb(root);
  if (violations.length > 0) {
    for (const item of violations) {
      console.error(`${item.file}:${item.line}:${item.column} ${item.message}`);
    }
    process.exit(1);
  }
}
