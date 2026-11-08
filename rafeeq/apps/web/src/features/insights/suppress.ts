/**
 * MASTER Section 6 and Section 8: analyst aggregates are k-anonymity >= 5.
 * This is a display rule. It does not compute a rate or an interval.
 */
export const K_ANONYMITY_FLOOR = 5;

export type Suppressible = {
  n: number | null;
  suppressed: boolean | null;
};

export function isSuppressed(cell: Suppressible): boolean {
  if (cell.suppressed === true) {
    return true;
  }
  if (cell.n === null) {
    return false;
  }
  return cell.n < K_ANONYMITY_FLOOR;
}

/** Bar height input. A suppressed cell contributes no count to the plot. */
export function plotValue(cell: Suppressible): number | null {
  if (isSuppressed(cell)) {
    return null;
  }
  return cell.n;
}
