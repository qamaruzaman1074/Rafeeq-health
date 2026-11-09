/**
 * Builds Rafeeq public knowledge markdown from approved /content and en/public copy.
 * Run: node scripts/build-knowledge.mjs
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(root, "../..");
const outDir = join(root, "knowledge", "sources");

function stableId(text) {
  return createHash("sha256").update(text).digest("hex").slice(0, 12);
}

function frontMatter(meta) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(meta)) {
    lines.push(`${key}: ${JSON.stringify(value)}`);
  }
  lines.push("---", "");
  return lines.join("\n");
}

function writeDoc(filename, meta, body) {
  const trimmed = body.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (/\bOPEN_QUESTION\b|TODO_AR|\bplaceholder\b/i.test(trimmed)) {
    return { filename, status: "skipped", reason: "incomplete_marker" };
  }
  const full = `${frontMatter(meta)}${trimmed}\n`;
  writeFileSync(join(outDir, filename), full, "utf8");
  return {
    filename,
    status: "written",
    sha256: createHash("sha256").update(full).digest("hex"),
    ...meta,
  };
}

function flattenPublic(node, prefix, out) {
  if (typeof node === "string") {
    const key = prefix.join(".");
    if (node.trim().length > 0 && !/^nav\.|^footer\./.test(key)) {
      out.push({ key, text: node.trim() });
    }
    return;
  }
  if (node !== null && typeof node === "object" && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node)) {
      flattenPublic(v, [...prefix, k], out);
    }
    return;
  }
  if (Array.isArray(node)) {
    const joined = node
      .filter((item) => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .join("\n\n");
    if (joined.length > 0) {
      const key = prefix.join(".");
      out.push({ key, text: joined });
    }
  }
}

function main() {
  mkdirSync(outDir, { recursive: true });
  const manifest = {
    builtAt: new Date().toISOString(),
    documents: [],
    flagged: [],
  };

  const blocks = JSON.parse(readFileSync(join(repoRoot, "content/blocks.en.json"), "utf8"));
  const faq = JSON.parse(readFileSync(join(repoRoot, "content/faq.json"), "utf8"));
  const pub = JSON.parse(readFileSync(join(root, "src/i18n/locales/en/public.json"), "utf8"));

  for (const [id, entry] of Object.entries(blocks)) {
    if (entry === null || typeof entry !== "object" || typeof entry.text !== "string") {
      continue;
    }
    const meta = {
      doc_id: id,
      title: id.replaceAll(".", " — "),
      source_url: "https://rafeeq-health.vercel.app/",
      last_updated: manifest.builtAt.slice(0, 10),
      content_status: entry.status ?? "draft",
      topic: id.split(".")[0],
    };
    const result = writeDoc(
      `block-${id.replaceAll(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`,
      meta,
      entry.text,
    );
    if (result?.status === "written") {
      manifest.documents.push(result);
    } else if (result) {
      manifest.flagged.push(result);
    }
  }

  const sections = [
    ["about", "/about", "About Rafeeq"],
    ["howItWorks", "/how-it-works", "How Rafeeq works"],
    ["risk", "/understanding-genetic-risk", "Understanding genetic risk"],
    ["conditions", "/inherited-conditions", "Inherited conditions"],
    ["counsellingPage", "/genetic-counselling", "Genetic counselling"],
    ["trustPublic", "/trust", "Privacy and trust"],
    ["faq", "/faq", "Frequently asked questions"],
    ["contact", "/contact", "Contact"],
    ["privacyPolicy", "/privacy-policy", "Privacy policy"],
    ["terms", "/terms", "Terms and conditions"],
    ["home", "/", "Rafeeq home"],
  ];

  for (const [key, url, title] of sections) {
    const section = pub[key];
    if (section === undefined) {
      manifest.flagged.push({ section: key, reason: "missing_public_copy" });
      continue;
    }
    const lines = [];
    flattenPublic(section, [key], lines);
    const body = lines.map((line) => `### ${line.key}\n\n${line.text}`).join("\n\n");
    const meta = {
      doc_id: `public.${key}`,
      title,
      source_url: `https://rafeeq-health.vercel.app${url}`,
      last_updated: manifest.builtAt.slice(0, 10),
      content_status: "draft",
      topic: key,
    };
    const result = writeDoc(`public-${key}.md`, meta, body);
    if (result?.status === "written") {
      manifest.documents.push(result);
    } else if (result) {
      manifest.flagged.push(result);
    }
  }

  const faqLines = faq
    .map((item) => {
      const answer = blocks[item.source_ids?.[0]]?.text;
      if (typeof answer !== "string") {
        manifest.flagged.push({ id: item.id, reason: "missing_faq_answer" });
        return null;
      }
      return `## ${item.question}\n\n${answer}\n\n_Source block: ${item.source_ids[0]}_`;
    })
    .filter(Boolean)
    .join("\n\n");

  const faqMeta = {
    doc_id: "faq.compiled",
    title: "Rafeeq FAQ (compiled)",
    source_url: "https://rafeeq-health.vercel.app/faq",
    last_updated: manifest.builtAt.slice(0, 10),
    content_status: "draft",
    topic: "faq",
  };
  const faqResult = writeDoc("faq-compiled.md", faqMeta, faqLines);
  if (faqResult?.status === "written") {
    manifest.documents.push(faqResult);
  }

  const limits = readFileSync(join(repoRoot, "docs/ASSUMPTIONS_AND_LIMITATIONS.md"), "utf8");
  if (limits.replace(/^#.*$/m, "").trim().length > 20) {
    const limitMeta = {
      doc_id: "docs.assumptions",
      title: "Assumptions and limitations",
      source_url: "https://rafeeq-health.vercel.app/",
      last_updated: manifest.builtAt.slice(0, 10),
      content_status: "draft",
      topic: "limitations",
    };
    const limitResult = writeDoc("platform-limitations.md", limitMeta, limits);
    if (limitResult?.status === "written") {
      manifest.documents.push(limitResult);
    }
  } else {
    const platformLimits = [
      "RAFEEQ is an educational and decision-support platform.",
      "It does not diagnose inherited conditions, guarantee outcomes, or replace qualified healthcare professionals.",
      "Numbers in the couple demo come from a deterministic kernel when a live API is connected; this public assistant does not compute personal genetic risk.",
      "Content marked draft is synthetic prototype material and is not clinician-reviewed.",
      "Arabic locale and production API on Azure are not yet available on all deployments.",
    ].join("\n\n");
    const limitMeta = {
      doc_id: "platform.limitations",
      title: "Platform limitations (documented)",
      source_url: "https://rafeeq-health.vercel.app/trust",
      last_updated: manifest.builtAt.slice(0, 10),
      content_status: "draft",
      topic: "limitations",
    };
    const limitResult = writeDoc("platform-limitations.md", limitMeta, platformLimits);
    if (limitResult?.status === "written") {
      manifest.documents.push(limitResult);
    }
  }

  writeFileSync(join(root, "knowledge", "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `Knowledge build: ${manifest.documents.length} documents, ${manifest.flagged.length} flagged.`,
  );
  if (manifest.flagged.length > 0) {
    console.log("Flagged for review:", manifest.flagged.slice(0, 5));
  }
}

main();
