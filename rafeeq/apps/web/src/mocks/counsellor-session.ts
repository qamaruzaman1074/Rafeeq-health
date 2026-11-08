/**
 * OPEN_QUESTION: MASTER Section 6 names POST `/auth/login` as email + password
 * for demo accounts, and does not name the accounts or the response body.
 * The mock treats `{ "role": "counsellor" }` as enough to open the counsellor
 * console. No password, token, or email is invented.
 */
let active = false;

export function beginCounsellorSession(): void {
  active = true;
}

export function endCounsellorSession(): void {
  active = false;
}

export function counsellorActive(): boolean {
  return active;
}
