export const SESSION_ROLES = ["couple", "counsellor", "analyst", "admin", "guest"] as const;

export type SessionRole = (typeof SESSION_ROLES)[number];

export type GuardRole = Exclude<SessionRole, "guest">;

// OPEN_QUESTION: MASTER.md does not specify how the shell reads the signed-in role.
// The session starts empty, so guarded routes redirect to /.
// OPEN_QUESTION: the guest response has persona_id, but later requests have no
// documented way to name that persona. The web session keeps it in memory so
// query keys change when the guest enters another persona.
let currentRole: SessionRole | null = null;
let currentPersonaId: string | null = null;

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function getSessionRole(): SessionRole | null {
  return currentRole;
}

export function getSessionPersona(): string | null {
  return currentPersonaId;
}

export function setSessionPersona(personaId: string | null): void {
  currentPersonaId = personaId;
  emit();
}

export function setSessionRole(role: SessionRole | null): void {
  currentRole = role;
  if (role === null) {
    currentPersonaId = null;
  }
  emit();
}

export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function effectiveRole(role: SessionRole | null): GuardRole | null {
  if (role === null) {
    return null;
  }
  if (role === "guest") {
    return "couple";
  }
  return role;
}

export function canAccess(role: SessionRole | null, allow: readonly GuardRole[]): boolean {
  const effective = effectiveRole(role);
  return effective !== null && allow.includes(effective);
}
