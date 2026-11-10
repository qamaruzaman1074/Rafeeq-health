export type CheckFlow = {
  index: number;
  attempt: number;
  finished: boolean;
  showFeedback: boolean;
};

export function initialFlow(): CheckFlow {
  return { index: 0, attempt: 1, finished: false, showFeedback: false };
}

export function nextIndexFor(
  items: readonly { id: string }[],
  nextItemId: string | null,
): number | null {
  if (nextItemId === null) {
    return null;
  }
  const index = items.findIndex((item) => item.id === nextItemId);
  return index === -1 ? null : index;
}

export function skipForNow(flow: CheckFlow, itemCount: number): CheckFlow {
  if (flow.finished || itemCount <= 0 || flow.index >= itemCount - 1) {
    return { index: flow.index, attempt: flow.attempt, finished: true, showFeedback: false };
  }
  return { index: flow.index + 1, attempt: 1, finished: false, showFeedback: false };
}

export function applyAnswer(
  flow: CheckFlow,
  itemCount: number,
  outcome: { matched: boolean; nextIndex: number | null },
): CheckFlow {
  if (flow.finished || itemCount <= 0) {
    return { ...flow, finished: true, showFeedback: false };
  }
  if (!outcome.matched) {
    return {
      index: flow.index,
      attempt: flow.attempt + 1,
      finished: false,
      showFeedback: true,
    };
  }
  if (outcome.nextIndex === null || outcome.nextIndex < 0 || outcome.nextIndex >= itemCount) {
    return {
      index: flow.index,
      attempt: flow.attempt,
      finished: true,
      showFeedback: false,
    };
  }
  return {
    index: outcome.nextIndex,
    attempt: 1,
    finished: false,
    showFeedback: false,
  };
}
