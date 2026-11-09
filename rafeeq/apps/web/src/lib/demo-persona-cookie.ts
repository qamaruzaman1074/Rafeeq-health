const COOKIE_NAME = "rafeeq_demo_persona";

function encode(value: string): string {
  return encodeURIComponent(value);
}

/** Binds the active demo persona for MSW handlers (sent on every same-origin request). */
export function writeDemoPersonaCookie(personaId: string): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${COOKIE_NAME}=${encode(personaId)}; Path=/; SameSite=Lax`;
}

export function clearDemoPersonaCookie(): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function readDemoPersonaFromCookieHeader(cookieHeader: string | null): string | null {
  if (cookieHeader === null || cookieHeader.length === 0) {
    return null;
  }
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === COOKIE_NAME) {
      const value = rest.join("=").trim();
      if (value.length === 0) {
        return null;
      }
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }
  return null;
}
