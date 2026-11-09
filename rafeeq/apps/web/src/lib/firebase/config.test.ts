import { describe, expect, it } from "vitest";
import { getFirebaseApp } from "@/lib/firebase/config";
import { firebaseEnabled, mocksEnabled } from "@/lib/firebase/env";

describe("firebase env helpers", () => {
  it("enables mocks only for the string true", () => {
    expect(mocksEnabled("true")).toBe(true);
    expect(mocksEnabled("false")).toBe(false);
    expect(mocksEnabled(undefined)).toBe(false);
  });

  it("enables Firebase only for the string true", () => {
    expect(firebaseEnabled("true")).toBe(true);
    expect(firebaseEnabled("false")).toBe(false);
  });

  it("does not initialize Firebase when the mode switch is off", () => {
    expect(getFirebaseApp()).toBeNull();
  });
});
