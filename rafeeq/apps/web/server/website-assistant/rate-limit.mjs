import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "./constants.mjs";

const buckets = new Map();

function prune(now) {
  for (const [key, entry] of buckets) {
    if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
      buckets.delete(key);
    }
  }
}

export function consumeRateLimit(clientKey) {
  const now = Date.now();
  prune(now);
  const key = clientKey || "anonymous";
  let entry = buckets.get(key);
  if (entry === undefined || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    entry = { start: now, count: 0 };
    buckets.set(key, entry);
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) {
    return { ok: false };
  }
  return { ok: true, remaining: RATE_LIMIT_MAX - entry.count };
}
