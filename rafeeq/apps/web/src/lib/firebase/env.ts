export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function mocksEnabled(flag: string | undefined): boolean {
  return flag === "true";
}

export function firebaseEnabled(flag: string | undefined): boolean {
  return flag === "true";
}

export function readFirebaseWebConfig(): FirebaseWebConfig | null {
  const entries: Array<[keyof FirebaseWebConfig, string | undefined]> = [
    ["apiKey", import.meta.env.VITE_FIREBASE_API_KEY],
    ["authDomain", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN],
    ["projectId", import.meta.env.VITE_FIREBASE_PROJECT_ID],
    ["storageBucket", import.meta.env.VITE_FIREBASE_STORAGE_BUCKET],
    ["messagingSenderId", import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID],
    ["appId", import.meta.env.VITE_FIREBASE_APP_ID],
  ];
  const config = {} as FirebaseWebConfig;
  for (const [key, value] of entries) {
    if (typeof value !== "string" || value.trim().length === 0) {
      return null;
    }
    config[key] = value.trim();
  }
  return config;
}
