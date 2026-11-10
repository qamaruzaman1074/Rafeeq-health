import personaFile from "../../../../content/personas.json";
import { z } from "zod";

const personaSchema = z.object({
  id: z.string().min(1),
  names: z.string().min(1),
  story: z.string().min(1),
  tests: z.string().min(1),
  status: z.literal("draft"),
  synthetic: z.literal(true),
});

const personaFileSchema = z.object({
  status: z.literal("draft"),
  synthetic: z.literal(true),
  personas: z.array(personaSchema).min(1),
});

export type Persona = z.infer<typeof personaSchema>;

export function parsePersonaFile(file: unknown): Persona[] {
  return personaFileSchema.parse(file).personas;
}

export const personas: readonly Persona[] = parsePersonaFile(personaFile);

export function findPersona(id: string): Persona | undefined {
  return personas.find((persona) => persona.id === id);
}
