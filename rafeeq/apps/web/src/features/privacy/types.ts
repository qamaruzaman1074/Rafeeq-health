import { z } from "zod";
import { CONSENT_SCOPES } from "@/features/couple/share-state";

export const ACTOR_ROLES = ["couple", "counsellor", "analyst", "admin", "guest"] as const;

export const AUDIT_ACTIONS = ["read", "grant", "revoke"] as const;

export const AUDIT_OBJECTS = ["results", "shares", "consents"] as const;

export const mineConsentSchema = z.object({
  id: z.string(),
  scope: z.enum(CONSENT_SCOPES),
  granted: z.boolean(),
  version: z.number().int(),
  created_at: z.string(),
});

export type MineConsent = z.infer<typeof mineConsentSchema>;

export const mineConsentListSchema = z.array(mineConsentSchema);

export const consentPostSchema = z.object({
  scope: z.enum(CONSENT_SCOPES),
  granted: z.boolean(),
});

export type ConsentPost = z.infer<typeof consentPostSchema>;

export const consentReceiptSchema = z.object({
  id: z.string(),
  consent_id: z.string(),
  scope: z.enum(CONSENT_SCOPES),
  granted: z.boolean(),
  version: z.number().int(),
  at: z.string(),
  prev_hash: z.null(),
  hash: z.null(),
});

export type ConsentReceipt = z.infer<typeof consentReceiptSchema>;

export const auditEntrySchema = z.object({
  id: z.string(),
  at: z.string(),
  actor_role: z.enum(ACTOR_ROLES),
  action: z.enum(AUDIT_ACTIONS),
  object_type: z.enum(AUDIT_OBJECTS),
  object_id: z.string().nullable(),
  outcome: z.literal("allowed"),
});

export type AuditEntry = z.infer<typeof auditEntrySchema>;

export const auditListSchema = z.array(auditEntrySchema);
