import { describe, expect, it } from "vitest";
import { validateContact } from "@/features/contact/validate";

describe("validateContact", () => {
  it("flags every missing field", () => {
    expect(validateContact({ name: " ", email: "nope", topic: "general", message: "hi" })).toEqual({
      name: true,
      email: true,
      message: true,
    });
  });

  it("accepts a complete draft", () => {
    expect(
      validateContact({
        name: "Sara",
        email: "sara@example.com",
        topic: "privacy",
        message: "How is consent recorded?",
      }),
    ).toEqual({});
  });
});
