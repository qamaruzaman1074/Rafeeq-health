import { describe, expect, it } from "vitest";
import { homeRouteForRole, roleFromAppMetadata } from "@/features/auth/supabase-auth";

describe("Supabase role mapping", () => {
  it("uses only recognized trusted application roles", () => {
    expect(roleFromAppMetadata({ role: "counsellor" })).toBe("counsellor");
    expect(roleFromAppMetadata({ role: "analyst" })).toBe("analyst");
    expect(roleFromAppMetadata({ role: "admin" })).toBe("admin");
    expect(roleFromAppMetadata({ role: "guest" })).toBe("couple");
    expect(roleFromAppMetadata({ role: "unknown" })).toBe("couple");
    expect(roleFromAppMetadata({})).toBe("couple");
  });

  it("routes trusted application roles to their home screens", () => {
    expect(homeRouteForRole("couple")).toBe("/app");
    expect(homeRouteForRole("counsellor")).toBe("/clinic");
    expect(homeRouteForRole("analyst")).toBe("/insights");
    expect(homeRouteForRole("admin")).toBe("/admin");
  });
});
