/** Internal marker when approved block text is not yet wired; never show verbatim in UI. */
export const INTERNAL_BLOCK_MARKER = "OPEN_QUESTION";

export function userVisibleBlockId(blockId: string): string | null {
  if (blockId === INTERNAL_BLOCK_MARKER || blockId.trim().length === 0) {
    return null;
  }
  return blockId;
}
