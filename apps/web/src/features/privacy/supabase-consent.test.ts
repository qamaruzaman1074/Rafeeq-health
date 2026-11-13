import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setAuthenticatedSession, setSessionRole } from "@/app/session";
import { fetchMineConsents, fetchReceipt, postConsent } from "@/features/privacy/api";
import type { ConsentScope } from "@/features/couple/share-state";

type Preference = {
  user_id: string;
  scope: ConsentScope;
  granted: boolean;
  version: number;
  updated_at: string;
};

type Event = {
  id: string;
  user_id: string;
  scope: ConsentScope;
  granted: boolean;
  version: number;
  created_at: string;
};

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

let preferences: Preference[] = [];
let events: Event[] = [];
let nextEventId = 0;

class FakeQueryBuilder {
  private readonly filters: Array<[string, unknown]> = [];
  private operation: "select" | "insert" | "update" = "select";
  private inserted: { user_id: string; scope: ConsentScope; granted: boolean } | null = null;
  private updated: { granted: boolean } | null = null;

  constructor(private readonly table: string) {}

  select(): this {
    return this;
  }

  eq(column: string, value: unknown): this {
    this.filters.push([column, value]);
    return this;
  }

  order(): this {
    return this;
  }

  limit(): this {
    return this;
  }

  insert(value: { user_id: string; scope: ConsentScope; granted: boolean }): this {
    this.operation = "insert";
    this.inserted = value;
    return this;
  }

  update(value: { granted: boolean }): this {
    this.operation = "update";
    this.updated = value;
    return this;
  }

  maybeSingle(): Promise<{ data: unknown; error: null }> {
    return Promise.resolve(this.execute(true));
  }

  then<TResult1 = { data: unknown; error: null }, TResult2 = never>(
    onfulfilled?:
      ((value: { data: unknown; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.execute(false)).then(onfulfilled, onrejected);
  }

  private execute(single: boolean): { data: unknown; error: null } {
    if (this.table === "consent_preferences" && this.operation === "insert") {
      if (this.inserted === null) {
        throw new Error("Missing insert payload.");
      }
      const row: Preference = {
        ...this.inserted,
        version: 1,
        updated_at: "2026-11-14T12:00:00.000Z",
      };
      preferences.push(row);
      this.recordEvent(row);
      return { data: single ? { scope: row.scope } : null, error: null };
    }

    const source = this.table === "consent_preferences" ? preferences : events;
    const matches = source.filter((row) =>
      this.filters.every(([column, value]) =>
        Object.entries(row).some(([key, rowValue]) => key === column && rowValue === value),
      ),
    );

    if (this.table === "consent_preferences" && this.operation === "update") {
      if (matches.length === 0 || this.updated === null) {
        return { data: null, error: null };
      }
      const row = matches[0];
      if (row === undefined) {
        return { data: null, error: null };
      }
      row.granted = this.updated.granted;
      row.version += 1;
      row.updated_at = "2026-11-14T12:01:00.000Z";
      this.recordEvent(row);
      return { data: single ? { scope: row.scope } : null, error: null };
    }

    return { data: single ? (matches[0] ?? null) : matches, error: null };
  }

  private recordEvent(row: Preference): void {
    nextEventId += 1;
    events.push({
      id: `event-${nextEventId}`,
      user_id: row.user_id,
      scope: row.scope,
      granted: row.granted,
      version: row.version,
      created_at: row.updated_at,
    });
  }
}

describe("Supabase consent service", () => {
  beforeEach(() => {
    preferences = [];
    events = [];
    nextEventId = 0;
    mockedSupabase.getUser.mockResolvedValue({
      data: { user: { id: "user-a" } },
      error: null,
    });
    mockedSupabase.from.mockImplementation((table: string) => new FakeQueryBuilder(table));
    setAuthenticatedSession("couple", "user-a");
  });

  afterEach(() => {
    setSessionRole(null);
  });

  it("saves and retrieves preferences and a receipt for the authenticated user", async () => {
    const saved = await postConsent({ scope: "share_with_clinic", granted: true });

    expect(saved).toEqual([
      {
        id: "share_with_clinic",
        scope: "share_with_clinic",
        granted: true,
        version: 1,
        created_at: "2026-11-14T12:00:00.000Z",
      },
    ]);
    expect(await fetchMineConsents()).toEqual(saved);
    expect(await fetchReceipt("share_with_clinic")).toEqual({
      id: "event-1",
      consent_id: "share_with_clinic",
      scope: "share_with_clinic",
      granted: true,
      version: 1,
      at: "2026-11-14T12:00:00.000Z",
      prev_hash: null,
      hash: null,
    });
    expect(mockedSupabase.from).toHaveBeenCalledWith("consent_preferences");
    expect(mockedSupabase.from).toHaveBeenCalledWith("consent_events");
  });

  it("isolates reads and updates by the authenticated user ID", async () => {
    preferences = [
      {
        user_id: "user-a",
        scope: "share_overlap_with_partner",
        granted: true,
        version: 1,
        updated_at: "2026-11-14T12:00:00.000Z",
      },
      {
        user_id: "user-b",
        scope: "share_overlap_with_partner",
        granted: true,
        version: 1,
        updated_at: "2026-11-14T12:00:00.000Z",
      },
    ];

    const userAConsents = await fetchMineConsents();
    expect(userAConsents).toHaveLength(1);
    expect(userAConsents?.[0]?.id).toBe("share_overlap_with_partner");

    await postConsent({ scope: "share_overlap_with_partner", granted: false });
    expect(preferences.find((row) => row.user_id === "user-a")?.granted).toBe(false);
    expect(preferences.find((row) => row.user_id === "user-b")?.granted).toBe(true);
  });

  it("does not allow withdrawing the locked own-results consent", async () => {
    await expect(postConsent({ scope: "view_own", granted: false })).rejects.toThrow(
      "Your own results consent cannot be withdrawn.",
    );
    expect(mockedSupabase.from).not.toHaveBeenCalled();
  });

  it("keeps database row access restricted to the authenticated owner by RLS", () => {
    const migration = readFileSync(
      new URL(
        "../../../../../supabase/migrations/20261113203900_initial_rafeeq_schema.sql",
        import.meta.url,
      ),
      "utf8",
    );
    expect(migration).toMatch(
      /create policy consent_preferences_select_own[\s\S]*?using \(\(select auth\.uid\(\)\) = user_id\);/,
    );
    expect(migration).toMatch(
      /create policy consent_preferences_insert_own[\s\S]*?with check \(\(select auth\.uid\(\)\) = user_id\);/,
    );
    expect(migration).toMatch(
      /create policy consent_preferences_update_own[\s\S]*?using \(\(select auth\.uid\(\)\) = user_id\)[\s\S]*?with check \(\(select auth\.uid\(\)\) = user_id\);/,
    );
    expect(migration).toMatch(
      /create policy consent_events_select_own[\s\S]*?using \(\(select auth\.uid\(\)\) = user_id\);/,
    );
  });
});
