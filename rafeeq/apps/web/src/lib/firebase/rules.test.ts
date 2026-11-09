import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rulesPath = fileURLToPath(new URL("../../../firebase/firestore.rules", import.meta.url));

describe("firestore.rules document", () => {
  const rules = readFileSync(rulesPath, "utf8");

  it("requires authentication for user-owned documents", () => {
    expect(rules).toContain("match /users/{userId}");
    expect(rules).toContain("request.auth.uid == userId");
  });

  it("limits partnership reads to members", () => {
    expect(rules).toContain("match /partnerships/{partnershipId}");
    expect(rules).toContain("request.auth.uid in resource.data.memberUids");
  });

  it("keeps invitations separate from partnership data access", () => {
    expect(rules).toContain("match /invitations/{inviteId}");
    expect(rules).not.toMatch(/match \/invitations[\s\S]*allow read: if true/);
  });

  it("denies writes to demo fixtures", () => {
    expect(rules).toContain("match /demoFixtures/{document=**}");
    expect(rules).toContain("allow write: if false");
  });
});
