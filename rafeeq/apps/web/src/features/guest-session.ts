import { z } from "zod";
import { setSessionPersona, setSessionRole } from "@/app/session";
import { findPersona } from "@/features/personas";
import { apiRequest, ApiRequestError } from "@/lib/api";
import { writeDemoPersonaCookie } from "@/lib/demo-persona-cookie";
import { mocksEnabled } from "@/mocks/enable";

const guestSessionSchema = z.object({
  role: z.literal("guest"),
  persona_id: z.string(),
});

function unknownPersonaError(): ApiRequestError {
  return new ApiRequestError(400, {
    error: {
      code: "unknown_persona",
      message_key: "unknownPersona",
      request_id: "client",
    },
  });
}

function applyGuestSession(personaId: string): void {
  writeDemoPersonaCookie(personaId);
  setSessionRole("guest");
  setSessionPersona(personaId);
}

export async function startGuestSession(personaId: string): Promise<void> {
  if (findPersona(personaId) === undefined) {
    throw unknownPersonaError();
  }

  if (mocksEnabled(import.meta.env.VITE_USE_MOCKS)) {
    applyGuestSession(personaId);
    try {
      const result = await apiRequest<unknown>("/api/v1/auth/guest", {
        method: "POST",
        body: JSON.stringify({ persona_id: personaId }),
      });
      guestSessionSchema.parse(result.data);
    } catch {
      // MSW may register after first paint, or the hosting SW may block it.
      // Cookie + in-app session still bind the persona for the mock API.
    }
    return;
  }

  const result = await apiRequest<unknown>("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ persona_id: personaId }),
  });
  const session = guestSessionSchema.parse(result.data);
  if (session.persona_id !== personaId) {
    throw new Error("Guest session persona_id did not match the request");
  }
  applyGuestSession(personaId);
}
