import { getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase/config";

export function getFirebaseFirestore(): Firestore | null {
  const app = getFirebaseApp();
  if (app === null) {
    return null;
  }
  return getFirestore(app);
}
