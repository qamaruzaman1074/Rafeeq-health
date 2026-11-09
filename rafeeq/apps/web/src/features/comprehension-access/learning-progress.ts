import type { ComprehensionTopicId, LearningProgressSnapshot } from "./content-model";

const STORAGE_KEY = "rafeeq.learning-progress.demo";

type Stored = {
  visited: ComprehensionTopicId[];
  completed: ComprehensionTopicId[];
  review: ComprehensionTopicId[];
};

const listeners = new Set<() => void>();

function readStore(): Stored {
  if (typeof sessionStorage === "undefined") {
    return { visited: [], completed: [], review: [] };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return { visited: [], completed: [], review: [] };
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return { visited: [], completed: [], review: [] };
    }
    const record = parsed as Record<string, unknown>;
    const list = (key: string): ComprehensionTopicId[] => {
      const value = record[key];
      if (!Array.isArray(value)) {
        return [];
      }
      return value.filter((entry): entry is ComprehensionTopicId => typeof entry === "string");
    };
    return { visited: list("visited"), completed: list("completed"), review: list("review") };
  } catch {
    return { visited: [], completed: [], review: [] };
  }
}

function writeStore(data: Stored): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Demo state only.
  }
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeLearningProgress(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function learningProgressSnapshot(): LearningProgressSnapshot {
  const stored = readStore();
  return {
    topicsVisited: stored.visited,
    checksCompleted: stored.completed,
    topicsToReview: stored.review,
    demoState: true,
  };
}

export function markTopicVisited(topicId: ComprehensionTopicId): void {
  const stored = readStore();
  if (!stored.visited.includes(topicId)) {
    writeStore({ ...stored, visited: [...stored.visited, topicId] });
  }
}

export function recordCheckTopic(topicId: ComprehensionTopicId, correct: boolean): void {
  const stored = readStore();
  const visited = stored.visited.includes(topicId)
    ? stored.visited
    : [...stored.visited, topicId];
  const completed = stored.completed.includes(topicId)
    ? stored.completed
    : [...stored.completed, topicId];
  let review = stored.review;
  if (!correct && !review.includes(topicId)) {
    review = [...review, topicId];
  }
  if (correct) {
    review = review.filter((id) => id !== topicId);
  }
  writeStore({ visited, completed, review });
}

export function resetLearningProgressDemo(): void {
  writeStore({ visited: [], completed: [], review: [] });
}
