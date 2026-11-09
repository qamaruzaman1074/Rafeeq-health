import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { firebaseEnabled, readFirebaseWebConfig } from "@/lib/firebase/env";

let warnedMissingConfig = false;

/**
 * Returns a Firebase app only when `VITE_USE_FIREBASE=true` and every web
 * config variable is set. Mock development leaves this null so MSW stays default.
 */
export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseEnabled(import.meta.env.VITE_USE_FIREBASE)) {
    return null;
  }
  const config = readFirebaseWebConfig();
  if (config === null) {
    if (import.meta.env.DEV && !warnedMissingConfig) {
      warnedMissingConfig = true;
      console.warn(
        "[rafeeq] VITE_USE_FIREBASE is true but Firebase web config is incomplete. Falling back without Firebase.",
      );
    }
    return null;
  }
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(config);
}
