import { describe, expect, it } from "vitest";
import { landmarkName } from "@/lib/landmark-name";

describe("landmarkName", () => {
  it("keeps a reviewed label unchanged", () => {
    expect(landmarkName("Receipts", "Receipts")).toBe("Receipts");
  });

  it("adds the existing English label when the visible text is the shared placeholder", () => {
    expect(landmarkName("TODO_AR", "Receipts")).toBe("TODO_AR (Receipts)");
  });
});
