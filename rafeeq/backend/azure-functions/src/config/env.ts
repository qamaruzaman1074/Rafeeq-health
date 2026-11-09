export type AppEnv = {
  appEnv: string;
  allowedOrigins: string[];
  geminiApiKey: string | undefined;
  geminiModel: string;
  geminiFileSearchStore: string | undefined;
  databaseConnectionString: string | undefined;
};

function splitOrigins(value: string | undefined): string[] {
  if (value === undefined || value.trim().length === 0) {
    return [];
  }
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function loadEnv(): AppEnv {
  return {
    appEnv: process.env.APP_ENV ?? "local",
    allowedOrigins: splitOrigins(process.env.ALLOWED_ORIGINS),
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    geminiFileSearchStore: process.env.GEMINI_FILE_SEARCH_STORE,
    databaseConnectionString: process.env.DATABASE_CONNECTION_STRING,
  };
}
