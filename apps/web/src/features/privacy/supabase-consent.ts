import { supabase } from "@/utils/supabase";
import {
  consentPostSchema,
  consentReceiptSchema,
  mineConsentListSchema,
  type ConsentPost,
  type ConsentReceipt,
  type MineConsent,
} from "@/features/privacy/types";

async function authenticatedUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  if (data.user === null) {
    throw new Error("You must be signed in to access consent records.");
  }
  return data.user.id;
}

export async function fetchSupabaseMineConsents(): Promise<MineConsent[]> {
  const userId = await authenticatedUserId();
  const { data, error } = await supabase
    .from("consent_preferences")
    .select("scope, granted, version, updated_at")
    .eq("user_id", userId)
    .order("scope");
  if (error) {
    throw error;
  }
  return mineConsentListSchema.parse(
    data.map((row) => ({
      id: row.scope,
      scope: row.scope,
      granted: row.granted,
      version: row.version,
      created_at: row.updated_at,
    })),
  );
}

export async function postSupabaseConsent(body: ConsentPost): Promise<MineConsent[]> {
  const consent = consentPostSchema.parse(body);
  if (consent.scope === "view_own" && !consent.granted) {
    throw new Error("Your own results consent cannot be withdrawn.");
  }

  const userId = await authenticatedUserId();
  const { data: existing, error: lookupError } = await supabase
    .from("consent_preferences")
    .select("granted")
    .eq("user_id", userId)
    .eq("scope", consent.scope)
    .maybeSingle();
  if (lookupError) {
    throw lookupError;
  }

  if (existing?.granted !== consent.granted) {
    if (existing === null) {
      const { data, error } = await supabase
        .from("consent_preferences")
        .insert({ user_id: userId, scope: consent.scope, granted: consent.granted })
        .select("scope")
        .maybeSingle();
      if (error) {
        throw error;
      }
      if (data === null) {
        throw new Error("Consent was not saved.");
      }
    } else {
      const { data, error } = await supabase
        .from("consent_preferences")
        .update({ granted: consent.granted })
        .eq("user_id", userId)
        .eq("scope", consent.scope)
        .select("scope")
        .maybeSingle();
      if (error) {
        throw error;
      }
      if (data === null) {
        throw new Error("Consent was not updated.");
      }
    }
  }

  return fetchSupabaseMineConsents();
}

export async function fetchSupabaseReceipt(id: string): Promise<ConsentReceipt> {
  const parsedScope = consentPostSchema.shape.scope.safeParse(id);
  if (!parsedScope.success) {
    throw new Error("Unknown consent receipt.");
  }

  const userId = await authenticatedUserId();
  const { data, error } = await supabase
    .from("consent_events")
    .select("id, scope, granted, version, created_at")
    .eq("user_id", userId)
    .eq("scope", parsedScope.data)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (data === null) {
    throw new Error("Receipt response was empty.");
  }
  return consentReceiptSchema.parse({
    id: data.id,
    consent_id: data.scope,
    scope: data.scope,
    granted: data.granted,
    version: data.version,
    at: data.created_at,
    prev_hash: null,
    hash: null,
  });
}
