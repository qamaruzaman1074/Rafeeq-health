import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { AppProviders } from "@/app/providers";
import i18n from "@/i18n";
import { NAMESPACES } from "@/i18n/namespaces";
import { ApiRequestError, apiRequest } from "@/lib/api";
import { cn } from "@/lib/utils";
import { server } from "@/test/mocks/server";

const apiOrigin = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4010";

describe("web scaffold", () => {
  it("loads the app modules", () => {
    expect(AppProviders).toBeTypeOf("function");
    expect(apiRequest).toBeTypeOf("function");
  });

  it("registers Arabic and English bundles", () => {
    for (const namespace of NAMESPACES) {
      expect(i18n.hasResourceBundle("en", namespace), namespace).toBe(true);
      expect(i18n.hasResourceBundle("ar", namespace), namespace).toBe(true);
    }
    expect(i18n.t("app.placeholder")).toBe("");
    expect(i18n.t("common.languageName.ar")).toBe("Arabic");
  });

  it("keeps logical spacing classes", () => {
    const merged = cn("ps-4", "pe-2");
    expect(merged).toContain("ps-4");
    expect(merged).toContain("pe-2");
  });

  it("parses the success envelope", async () => {
    server.use(
      http.get(`${apiOrigin}/resource`, () =>
        HttpResponse.json({
          data: { ok: true },
          meta: { request_id: "req_1" },
        }),
      ),
    );

    const result = await apiRequest<{ ok: boolean }>("/resource");
    expect(result.meta.request_id).toBe("req_1");
    expect(result.data.ok).toBe(true);
  });

  it("parses the error envelope", async () => {
    server.use(
      http.get(`${apiOrigin}/resource`, () =>
        HttpResponse.json(
          {
            error: {
              code: "example_code",
              message_key: "example.message_key",
              request_id: "req_2",
            },
          },
          { status: 404 },
        ),
      ),
    );

    await expect(apiRequest("/resource")).rejects.toMatchObject({
      name: "ApiRequestError",
      status: 404,
      code: "example_code",
      messageKey: "example.message_key",
      requestId: "req_2",
    } satisfies Partial<ApiRequestError>);
  });
});
