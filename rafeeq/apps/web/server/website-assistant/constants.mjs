export const MESSAGE_MIN = 1;
export const MESSAGE_MAX = 500;
export const DEFAULT_MODEL = "gemini-2.5-flash";
export const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
export const RATE_LIMIT_MAX = 30;

export const RAFeeq_TOPIC_PATTERN =
  /\b(rafeeq|genetic|carrier|screening|counsell|counsel|privacy|consent|inherit|partner|pregnancy|risk|platform|demo|sharing|overlap|vus|recessive|premarital|preconception|trust|faq)\b/i;

export const SENSITIVE_GENETIC_PATTERN =
  /\b(my|our)\s+(genotype|variant|mutation|result|dna|rs\d+|c\.\d+|p\.\([A-Z]{3}\))\b/i;
