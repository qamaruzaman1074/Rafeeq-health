/**
 * The ask composer accepts at most this many characters.
 * MASTER Section 6 does not set the limit; the ask task does.
 */
export const QUESTION_LIMIT = 500;

export function limitQuestion(value: string): string {
  if (value.length <= QUESTION_LIMIT) {
    return value;
  }
  return value.slice(0, QUESTION_LIMIT);
}

export function questionTooLong(value: string): boolean {
  return value.length > QUESTION_LIMIT;
}
