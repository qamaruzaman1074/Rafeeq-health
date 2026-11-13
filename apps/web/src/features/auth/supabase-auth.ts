import { setAuthenticatedSession, type GuardRole } from "@/app/session";

export type SupabaseProfile = {
  id: string;
  display_name: string | null;
};

export type SupabaseAccountDisplay = {
  displayName: string | null;
  email: string | null;
};

export function errorMessageFrom(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return fallback;
}

export function roleFromAppMetadata(appMetadata: Record<string, unknown>): GuardRole {
  const role = appMetadata.role;
  switch (role) {
    case "counsellor":
    case "analyst":
    case "admin":
      return role;
    default:
      return "couple";
  }
}

export function homeRouteForRole(role: GuardRole): string {
  switch (role) {
    case "counsellor":
      return "/clinic";
    case "analyst":
      return "/insights";
    case "admin":
      return "/admin";
    default:
      return "/app";
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL?.trim() &&
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim(),
  );
}

export async function signInWithEmail(email: string, password: string): Promise<GuardRole> {
  const { supabase } = await import("@/utils/supabase");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
  if (data.user === null) {
    throw new Error("Supabase sign-in returned no user.");
  }
  const role = roleFromAppMetadata(data.user.app_metadata);
  setAuthenticatedSession(role, data.user.id);
  return role;
}

export async function signUpWithEmail(
  displayName: string,
  email: string,
  password: string,
): Promise<GuardRole | null> {
  const { supabase } = await import("@/utils/supabase");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) {
    throw error;
  }
  if (data.session !== null) {
    if (data.user === null) {
      throw new Error("Supabase sign-up returned a session without a user.");
    }
    const role = roleFromAppMetadata(data.user.app_metadata);
    setAuthenticatedSession(role, data.user.id);
    return role;
  }
  return null;
}

export async function restoreSupabaseSession(): Promise<GuardRole | null> {
  const { supabase } = await import("@/utils/supabase");
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  if (data.session === null) {
    return null;
  }
  const role = roleFromAppMetadata(data.session.user.app_metadata);
  setAuthenticatedSession(role, data.session.user.id);
  return role;
}

export async function signOutSupabase(): Promise<void> {
  const { supabase } = await import("@/utils/supabase");
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getOwnProfile(): Promise<SupabaseProfile | null> {
  const { supabase } = await import("@/utils/supabase");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw userError;
  }
  if (userData.user === null) {
    return null;
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data;
}

export async function updateOwnProfile(displayName: string): Promise<SupabaseProfile> {
  const normalizedName = displayName.trim();
  if (normalizedName.length === 0 || normalizedName.length > 120) {
    throw new Error("Display name must contain 1 to 120 characters.");
  }

  const { supabase } = await import("@/utils/supabase");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw userError;
  }
  if (userData.user === null) {
    throw new Error("You must be signed in to update your profile.");
  }

  const { data: existing, error: lookupError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (lookupError) {
    throw lookupError;
  }

  const result =
    existing === null
      ? await supabase
          .from("profiles")
          .insert({ id: userData.user.id, display_name: normalizedName })
          .select("id, display_name")
          .maybeSingle()
      : await supabase
          .from("profiles")
          .update({ display_name: normalizedName })
          .eq("id", userData.user.id)
          .select("id, display_name")
          .maybeSingle();
  if (result.error) {
    throw result.error;
  }
  if (result.data === null) {
    throw new Error("The updated profile could not be found.");
  }
  return result.data;
}

export async function getOwnAccountDisplay(): Promise<SupabaseAccountDisplay | null> {
  const { supabase } = await import("@/utils/supabase");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw userError;
  }
  if (userData.user === null) {
    return null;
  }
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  const metadataName = userData.user.user_metadata.display_name;
  const profileName = data?.display_name?.trim();
  return {
    displayName:
      (profileName === undefined || profileName.length === 0 ? null : profileName) ??
      (typeof metadataName === "string" && metadataName.trim().length > 0 ? metadataName : null),
    email: userData.user.email ?? null,
  };
}

export async function deleteOwnProfile(): Promise<boolean> {
  const { supabase } = await import("@/utils/supabase");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw userError;
  }
  if (userData.user === null) {
    throw new Error("You must be signed in to delete your profile.");
  }
  const { data, error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userData.user.id)
    .select("id")
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data !== null;
}
