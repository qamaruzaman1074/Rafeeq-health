import { z } from "zod";
import { setSessionPersona, setSessionRole } from "@/app/session";
import { apiRequest } from "@/lib/api";

const analystSessionSchema = z.object({
  role: z.literal("analyst"),
});

/**
 * OPEN_QUESTION: how an analyst signs in is not specified. This calls
 * POST `/auth/login` with `{ "role": "analyst" }` and stores the role
 * the same way a counsellor session stores `counsellor`. No email or
 * password is sent.
 */
export async function startAnalystSession(): Promise<void> {
  const result = await apiRequest<unknown>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ role: "analyst" }),
  });
  const session = analystSessionSchema.parse(result.data);
  setSessionRole(session.role);
  setSessionPersona(null);
}
