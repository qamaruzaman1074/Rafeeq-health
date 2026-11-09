import type { InvocationContext } from "@azure/functions";

export function logInfo(context: InvocationContext, message: string, props?: Record<string, string>) {
  const suffix =
    props === undefined
      ? ""
      : ` ${JSON.stringify(props, (_key, value) => (value === undefined ? "[redacted]" : value))}`;
  context.log(`${message}${suffix}`);
}

export function logError(context: InvocationContext, message: string, error?: unknown) {
  const detail = error instanceof Error ? error.message : "unknown";
  context.error(`${message}: ${detail}`);
}
