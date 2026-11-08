/**
 * OPEN_QUESTION: MASTER does not say where teach-back completion is stored.
 * This flag lives in memory, like the guest session, so Couple Home can read
 * it during the same visit. A reload clears it.
 * Finished and skipped-through both set the same flag. A separate skip status
 * is not specified.
 */

let checkComplete = false;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function isCheckComplete(): boolean {
  return checkComplete;
}

export function markCheckComplete(): void {
  if (checkComplete) {
    return;
  }
  checkComplete = true;
  emit();
}

export function resetCheckProgress(): void {
  checkComplete = false;
  emit();
}

export function subscribeCheckProgress(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function recordCheckOutcome(flow: { finished: boolean }): void {
  if (flow.finished) {
    markCheckComplete();
  }
}
