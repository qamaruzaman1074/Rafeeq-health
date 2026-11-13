import { findPersona } from "@/features/personas";
import { clearDemoPersonaCookie, readDemoPersonaCookie } from "@/lib/demo-persona-cookie";

export const SESSION_ROLES = ["couple", "counsellor", "analyst", "admin", "guest"] as const;

export type SessionRole = (typeof SESSION_ROLES)[number];

export type GuardRole = Exclude<SessionRole, "guest">;

// The demo persona cookie restores this synthetic client session after reload; it is not an
// authentication credential.
let currentRole: SessionRole | null = null;
let currentPersonaId: string | null = null;
let currentSupabaseUserId: string | null = null;
let supabaseAuthenticated = false;

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

export function getSessionIdentity(): string | null {
  return supabaseAuthenticated ? currentSupabaseUserId : currentPersonaId;
}

export function isSupabaseAuthenticated(): boolean {
  return supabaseAuthenticated;
}

export function setSessionPersona(personaId: string | null): void {
  currentPersonaId = personaId;
  emit();
}

export function setSessionRole(role: SessionRole | null): void {
  supabaseAuthenticated = false;
  currentSupabaseUserId = null;
  currentRole = role;
  if (role === null) {
    currentPersonaId = null;
  }
  if (role !== "guest") {
    clearDemoPersonaCookie();
  }
  emit();
}

export function setAuthenticatedSession(role: GuardRole, userId: string): void {
  currentRole = role;
  currentPersonaId = null;
  currentSupabaseUserId = userId;
  supabaseAuthenticated = true;
  clearDemoPersonaCookie();
  emit();
}

export function restoreGuestSessionFromCookie(): void {
  if (currentRole !== null) {
    return;
  }
  const personaId = readDemoPersonaCookie();
  if (personaId === null) {
    return;
  }
  if (findPersona(personaId) === undefined) {
    clearDemoPersonaCookie();
    return;
  }
  currentRole = "guest";
  currentPersonaId = personaId;
  currentSupabaseUserId = null;
  supabaseAuthenticated = false;
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
