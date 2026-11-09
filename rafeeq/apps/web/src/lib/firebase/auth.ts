import { getAuth, type Auth } from "firebase/auth";
import { getFirebaseApp } from "@/lib/firebase/config";

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (app === null) {
    return null;
  }
  return getAuth(app);
}
