import { afterEach, describe, expect, it } from "vitest";
import { getSessionRole, setSessionRole } from "@/app/session";
import { startGuestSession } from "@/features/guest-session";
import { personas } from "@/features/personas";

const stories = [
  {
    id: "P1",
    names: "Noor & Khalid",
    story: "First cousins; both carry the same gene (hearing-loss example)",
    tests: "Overlap explanation, consanguinity wording, counselling T2",
  },
  {
    id: "P2",
    names: "Mariam & Saeed",
    story: "Unrelated; no shared genes; each carries different genes",
    tests: "Reassurance without false certainty, residual-risk wording",
  },
  {
    id: "P3",
    names: "Huda & Omar",
    story: "One carrier only",
    tests: "Residual risk range, T1/T2",
  },
  {
    id: "P4",
    names: "Fatima & Rashid",
    story: "Both carry same gene with early-treatment pathway (e.g., SMA example)",
    tests: "Priority routing T3",
  },
  {
    id: "P5",
    names: "Aisha & Hamad",
    story: "Partner B declines sharing",
    tests: "Privacy: overlap hidden, user can still use own info",
  },
  {
    id: "P6",
    names: "Salma & Yousef",
    story: "Result includes VUS flag",
    tests: "Ambiguity -> T4 human, no numbers",
  },
  {
    id: "P7",
    names: "Low-literacy voice-first user",
    story: "Any result, voice mode",
    tests: "TTS + simple mode + teach-back",
  },
] as const;

describe("persona fixtures", () => {
  it("seeds the seven Section 9 personas as draft synthetic fixtures", () => {
    expect(personas).toHaveLength(7);
    expect(
      personas.map((persona) => ({
        id: persona.id,
        names: persona.names,
        story: persona.story,
        tests: persona.tests,
      })),
    ).toEqual(stories.map((persona) => ({ ...persona })));
    for (const persona of personas) {
      expect(persona.status).toBe("draft");
      expect(persona.synthetic).toBe(true);
    }
  });
});

describe("guest session", () => {
  afterEach(() => {
    setSessionRole(null);
  });

  it("sets the guest role so the couple area can open", async () => {
    expect(getSessionRole()).toBeNull();
    await startGuestSession("P3");
    expect(getSessionRole()).toBe("guest");
  });

  it("does not set a role when the persona is unknown", async () => {
    await expect(startGuestSession("P0")).rejects.toThrow();
    expect(getSessionRole()).toBeNull();
  });
});
