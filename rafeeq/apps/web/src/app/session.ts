export const SESSION_ROLES = ["couple", "counsellor", "analyst", "admin", "guest"] as const;

export type SessionRole = (typeof SESSION_ROLES)[number];

export type GuardRole = Exclude<SessionRole, "guest">;

// OPEN_QUESTION: MASTER.md does not specify how the shell reads the signed-in role.
// The session starts empty, so guarded routes redirect to /.
let currentRole: SessionRole | null = null;

const listeners = new Set<() => void>();

export function getSessionRole(): SessionRole | null {
  return currentRole;
}

export function setSessionRole(role: SessionRole | null): void {
  currentRole = role;
  for (const listener of listeners) {
    listener();
  }
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
