const PUNCTUATION = /[^\p{L}\p{N}\s]+/gu;

export function normalizeQuery(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(PUNCTUATION, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeQuery(normalized: string): string[] {
  if (normalized.length === 0) {
    return [];
  }
  return normalized.split(" ").filter((token) => token.length > 1);
}
