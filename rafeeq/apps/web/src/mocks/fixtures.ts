import importedPersonas from "../../../../content/personas.json";

export const personaFile: unknown = importedPersonas;

export function hasPersonaFixtures(file: unknown): boolean {
  if (Array.isArray(file)) {
    return file.length > 0;
  }
  if (file !== null && typeof file === "object") {
    return Object.keys(file).length > 0;
  }
  return false;
}

/**
 * OPEN_QUESTION: MASTER Section 6 fixes the envelope, not the body of endpoints
 * other than the guest session this task binds to a persona. Those handlers
 * keep `data` null. POST /auth/guest is handled separately.
 */
export function mockPayload(file: unknown): null {
  if (!hasPersonaFixtures(file)) {
    return null;
  }
  return null;
}
