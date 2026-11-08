import { z } from "zod";
import { setSessionRole } from "@/app/session";
import { apiRequest } from "@/lib/api";

const guestSessionSchema = z.object({
  role: z.literal("guest"),
  persona_id: z.string(),
});

export async function startGuestSession(personaId: string): Promise<void> {
  const result = await apiRequest<unknown>("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ persona_id: personaId }),
  });
  const session = guestSessionSchema.parse(result.data);
  if (session.persona_id !== personaId) {
    throw new Error("Guest session persona_id did not match the request");
  }
  setSessionRole("guest");
}
