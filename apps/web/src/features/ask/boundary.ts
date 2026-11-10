import type { LocalizedBlock } from "@/features/couple/fact-card-dto";
import { readLocaleBlock, type LocaleCode } from "@/features/learn/blocks";

const BOUNDARY_BLOCK_ID = "ask.boundary";

/**
 * OPEN_QUESTION: blocks files have no ask boundary entry.
 * When the block has text, that approved line is the banner.
 * Otherwise the screen uses the ask catalog notice.
 */
export function boundaryBlocks(locale: LocaleCode): LocalizedBlock[] {
  const block = readLocaleBlock(locale, BOUNDARY_BLOCK_ID);
  if (block.text === null) {
    return [];
  }
  return [{ block_id: BOUNDARY_BLOCK_ID, locale, text: block.text }];
}
