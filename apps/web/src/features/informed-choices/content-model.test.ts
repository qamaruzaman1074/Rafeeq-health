import { describe, expect, it } from "vitest";
import {
  INFORMED_CHOICE_PATHWAY_IDS,
  REFLECTION_QUESTION_IDS,
} from "./content-model";

describe("informed choices content model", () => {
  it("defines four pathways and five reflection prompts", () => {
    expect(INFORMED_CHOICE_PATHWAY_IDS).toHaveLength(4);
    expect(REFLECTION_QUESTION_IDS).toHaveLength(5);
  });
});
