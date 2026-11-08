import { z } from "zod";
import { setSessionPersona, setSessionRole } from "@/app/session";
import { apiRequest } from "@/lib/api";

const counsellorSessionSchema = z.object({
  role: z.literal("counsellor"),
});

/**
 * OPEN_QUESTION: how a counsellor signs in is not specified. This calls
 * POST `/auth/login` with `{ "role": "counsellor" }` and stores the role
 * the same way a guest session stores `guest`. No email or password is sent.
 */
export async function startCounsellorSession(): Promise<void> {
  const result = await apiRequest<unknown>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ role: "counsellor" }),
  });
  const session = counsellorSessionSchema.parse(result.data);
  setSessionRole(session.role);
  setSessionPersona(null);
}
