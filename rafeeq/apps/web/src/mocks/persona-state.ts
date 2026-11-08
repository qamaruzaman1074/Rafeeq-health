let activePersonaId: string | null = null;

export function rememberPersona(personaId: string): void {
  activePersonaId = personaId;
}

export function currentPersonaId(): string | null {
  return activePersonaId;
}

export function resetActivePersona(): void {
  activePersonaId = null;
}
