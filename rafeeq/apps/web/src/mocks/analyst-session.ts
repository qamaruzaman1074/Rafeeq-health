/**
 * OPEN_QUESTION: MASTER Section 6 names POST `/auth/login` as email + password
 * for demo accounts, and does not name an analyst account or the response body.
 * The mock treats `{ "role": "analyst" }` as enough to open insights.
 * No password, token, or email is invented.
 */
let active = false;

export function beginAnalystSession(): void {
  active = true;
}

export function endAnalystSession(): void {
  active = false;
}

export function analystActive(): boolean {
  return active;
}
