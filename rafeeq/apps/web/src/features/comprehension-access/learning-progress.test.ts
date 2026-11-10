import { describe, expect, it } from "vitest";
import { learningProgressSnapshot } from "./learning-progress";

describe("learning progress store", () => {
  it("keeps the snapshot reference stable while stored progress is unchanged", () => {
    expect(learningProgressSnapshot()).toBe(learningProgressSnapshot());
  });
});
