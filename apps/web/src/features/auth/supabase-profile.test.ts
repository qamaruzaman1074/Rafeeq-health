import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateOwnProfile } from "@/features/auth/supabase-auth";

const mockedSupabase = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
}));

vi.mock("@/utils/supabase", () => ({
  supabase: {
    auth: { getUser: mockedSupabase.getUser },
    from: mockedSupabase.from,
  },
}));

type ProfileRow = { id: string; display_name: string | null };

let existingProfile: ProfileRow | null;
const profileFilters: Array<[string, unknown]> = [];
const profileInserts: ProfileRow[] = [];

class FakeProfileQuery {
  private operation: "select" | "insert" | "update" = "select";
  private payload: Partial<ProfileRow> = {};

  select(): this {
    return this;
  }

  eq(column: string, value: unknown): this {
    profileFilters.push([column, value]);
    return this;
  }

  insert(value: ProfileRow): this {
    this.operation = "insert";
    this.payload = value;
    return this;
  }

  update(value: Partial<ProfileRow>): this {
    this.operation = "update";
    this.payload = value;
    return this;
  }

  async maybeSingle(): Promise<{ data: ProfileRow | null; error: null }> {
    if (this.operation === "insert") {
      existingProfile = this.payload as ProfileRow;
      profileInserts.push(existingProfile);
    } else if (this.operation === "update" && existingProfile !== null) {
      existingProfile = { ...existingProfile, ...this.payload };
    }
    return { data: existingProfile, error: null };
  }
}

describe("Supabase profile editing", () => {
  beforeEach(() => {
    existingProfile = null;
    profileFilters.length = 0;
    profileInserts.length = 0;
    mockedSupabase.getUser.mockResolvedValue({
      data: { user: { id: "user-a" } },
      error: null,
    });
    mockedSupabase.from.mockImplementation((table: string) => {
      if (table !== "profiles") {
        throw new Error(`Unexpected table: ${table}`);
      }
      return new FakeProfileQuery();
    });
  });

  it("updates only the authenticated user's display name", async () => {
    existingProfile = { id: "user-a", display_name: "Old name" };

    await expect(updateOwnProfile("  New name  ")).resolves.toEqual({
      id: "user-a",
      display_name: "New name",
    });
    expect(profileFilters).toContainEqual(["id", "user-a"]);
  });

  it("restores a missing own profile record and rejects blank names", async () => {
    await expect(updateOwnProfile("New name")).resolves.toEqual({
      id: "user-a",
      display_name: "New name",
    });
    expect(profileInserts).toEqual([{ id: "user-a", display_name: "New name" }]);
    await expect(updateOwnProfile("   ")).rejects.toThrow(
      "Display name must contain 1 to 120 characters.",
    );
  });
});
