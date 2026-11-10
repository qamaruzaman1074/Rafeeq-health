import { describe, expect, it } from "vitest";
import { COMPREHENSION_TOPIC_IDS } from "./content-model";
import { EDUCATIONAL_QUESTIONS } from "./demo-data";

describe("comprehension access model", () => {
  it("defines six educational topics with questions", () => {
    expect(COMPREHENSION_TOPIC_IDS).toHaveLength(6);
    expect(EDUCATIONAL_QUESTIONS).toHaveLength(6);
  });
});
