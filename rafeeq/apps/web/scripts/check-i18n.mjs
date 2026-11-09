import { createRequire } from "node:module";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

export const REQUIRED_NAMESPACES = [
  "common",
  "public",
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
  "website-assistant",
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

function collectTranslationContext(source) {
  const nsBindings = new Map();
  const defaultNamespace = new Map();

  function visit(node) {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (
          ts.isIdentifier(decl.name) &&
          decl.initializer !== undefined &&
          ts.isStringLiteral(decl.initializer)
        ) {
          nsBindings.set(decl.name.text, decl.initializer.text);
        }
      }
    }

    if (ts.isCallExpression(node) && calleeName(node.expression) === "useTranslation") {
      const arg = node.arguments[0];
      if (arg !== undefined && ts.isStringLiteral(arg)) {
        let parent = node.parent;
        while (parent !== undefined) {
          if (ts.isFunctionLike(parent)) {
            defaultNamespace.set(parent, arg.text);
            break;
          }
          parent = parent.parent;
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);
  return { nsBindings, defaultNamespace };
}

function namespaceFromCall(node, context) {
  const option = node.arguments[1];
  if (option !== undefined && ts.isObjectLiteralExpression(option)) {
    for (const property of option.properties) {
      if (ts.isPropertyAssignment(property) && propertyName(property.name) === "ns") {
        if (ts.isStringLiteral(property.initializer)) {
          return property.initializer.text;
        }
      }
      if (ts.isShorthandPropertyAssignment(property) && property.name.text === "ns") {
        return context.nsBindings.get("ns") ?? "common";
      }
    }
  }

  let parent = node.parent;
  while (parent !== undefined) {
    if (ts.isFunctionLike(parent) && context.defaultNamespace.has(parent)) {
      return context.defaultNamespace.get(parent);
    }
    parent = parent.parent;
  }
  return "common";
}

function isIgnorableJsxText(text) {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return true;
  }
  return /^(&[#\w]+;|\s)+$/.test(trimmed);
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

const SUPPORTED_LOCALES = ["en"];

export function loadCatalogs(localesDir) {
  const catalogs = { en: {} };
  for (const locale of SUPPORTED_LOCALES) {
    const directory = path.join(localesDir, locale);
    if (!statSync(directory).isDirectory()) {
      continue;
    }
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
  const namespaces = [...new Set([...REQUIRED_NAMESPACES, ...english])].sort();

  for (const namespace of namespaces) {
    if (!english.has(namespace)) {
      violations.push({
        file: `src/i18n/locales/en/${namespace}.json`,
        line: 1,
        column: 1,
        message: `Missing locale file for namespace "${namespace}"`,
      });
    }
  }
  return violations;
}

function knownKey(catalogs, dotted) {
  return Object.values(catalogs.en).some((catalog) => hasKey(catalog, dotted));
}

export function auditSource(text, file, catalogs) {
  const scriptKind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, scriptKind);
  const translationContext = collectTranslationContext(source);
  const violations = [];

  function visit(node) {
    if (
      ts.isJsxText(node) &&
      hasLetters(node.getText(source)) &&
      !isIgnorableJsxText(node.getText(source))
    ) {
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
          violations.push(violation(file, source, node, `Missing i18n key "${textValue}" in en`));
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
            `Missing i18n key "${node.initializer.text}" in en`,
          ),
        );
      }
    }

    if (ts.isCallExpression(node) && calleeName(node.expression) === "t") {
      const first = node.arguments[0];
      if (first !== undefined && ts.isStringLiteral(first)) {
        const namespace = namespaceFromCall(node, translationContext);
        const key = first.text;
        const catalog = catalogs.en[namespace];
        if (catalog === undefined || !hasKey(catalog, key)) {
          violations.push(
            violation(file, source, first, `Missing i18n key "${key}" in en/${namespace}.json`),
          );
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
