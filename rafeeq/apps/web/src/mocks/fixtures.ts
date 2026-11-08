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
 * OPEN_QUESTION: content/personas.json has no records, and MASTER Section 9
 * does not define a JSON schema. Handlers return an empty payload either way.
 */
export function mockPayload(file: unknown): null {
  if (!hasPersonaFixtures(file)) {
    return null;
  }
  return null;
}
