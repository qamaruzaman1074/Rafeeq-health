import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setAuthenticatedSession, setSessionRole } from "@/app/session";
import {
  createOwnReportSignedUrl,
  fetchOwnReports,
  findOwnReportByCode,
  generateReportAccessCode,
  isValidReportAccessCode,
  MAX_REPORT_SIZE_BYTES,
  PRIVATE_REPORT_BUCKET,
  uploadOwnReport,
  type ScreeningReport,
} from "@/features/reports/supabase-reports";
import { downloadOwnFile, listOwnFiles } from "@/features/reports/supabase-storage";
import { createSyntheticReportFile } from "@/features/reports/synthetic-report-file";

const mockedSupabase = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
  storageFrom: vi.fn(),
  upload: vi.fn(),
  list: vi.fn(),
  download: vi.fn(),
  remove: vi.fn(),
  createSignedUrl: vi.fn(),
}));

vi.mock("@/utils/supabase", () => ({
  supabase: {
    auth: { getUser: mockedSupabase.getUser },
    from: mockedSupabase.from,
    storage: { from: mockedSupabase.storageFrom },
  },
}));

type ReportInsert = Omit<ScreeningReport, "user_id" | "created_at">;

const reports: ScreeningReport[] = [];
const filterCalls: Array<[string, unknown]> = [];
let currentUserId = "user-a";
let nextReportId = 0;

class FakeReportQuery {
  private readonly filters: Array<[string, unknown]> = [];
  private operation: "select" | "insert" | "delete" = "select";
  private inserted: Partial<ScreeningReport> | null = null;

  constructor(private readonly table: string) {}

  select(): this {
    return this;
  }

  eq(column: string, value: unknown): this {
    this.filters.push([column, value]);
    filterCalls.push([column, value]);
    return this;
  }

  order(): this {
    return this;
  }

  insert(value: ReportInsert): this {
    this.operation = "insert";
    this.inserted = value;
    return this;
  }

  delete(): this {
    this.operation = "delete";
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
    if (this.table !== "screening_reports") {
      throw new Error(`Unexpected table: ${this.table}`);
    }

    if (this.operation === "insert") {
      if (this.inserted === null) {
        throw new Error("Missing report insert payload.");
      }
      nextReportId += 1;
      const row = {
        id: `report-${nextReportId}`,
        user_id: currentUserId,
        created_at: "2026-11-14T12:00:00.000Z",
        ...this.inserted,
      } as ScreeningReport;
      reports.push(row);
      return { data: single ? row : null, error: null };
    }

    const matches = reports.filter((report) =>
      this.filters.every(([column, value]) => report[column as keyof ScreeningReport] === value),
    );
    if (this.operation === "delete") {
      const match = matches[0];
      if (match !== undefined) {
        reports.splice(reports.indexOf(match), 1);
      }
      return { data: single ? (match === undefined ? null : { id: match.id }) : null, error: null };
    }
    return { data: single ? (matches[0] ?? null) : matches, error: null };
  }
}

describe("Supabase screening reports", () => {
  beforeEach(() => {
    reports.length = 0;
    filterCalls.length = 0;
    nextReportId = 0;
    currentUserId = "user-a";
    mockedSupabase.getUser.mockResolvedValue({
      data: { user: { id: currentUserId } },
      error: null,
    });
    mockedSupabase.from.mockImplementation((table: string) => new FakeReportQuery(table));
    mockedSupabase.upload.mockResolvedValue({ data: { path: "stored" }, error: null });
    mockedSupabase.list.mockImplementation(async (path: string) => ({
      data: reports
        .filter((report) => report.object_path.startsWith(`${path}/`))
        .map((report) => ({
          name: report.object_path.slice(`${path}/`.length),
          id: report.id,
        })),
      error: null,
    }));
    mockedSupabase.download.mockResolvedValue({
      data: new Blob(["synthetic"]),
      error: null,
    });
    mockedSupabase.remove.mockResolvedValue({ data: [], error: null });
    mockedSupabase.createSignedUrl.mockResolvedValue({
      data: { signedUrl: "https://private.example/signed" },
      error: null,
    });
    mockedSupabase.storageFrom.mockReturnValue({
      upload: mockedSupabase.upload,
      list: mockedSupabase.list,
      download: mockedSupabase.download,
      remove: mockedSupabase.remove,
      createSignedUrl: mockedSupabase.createSignedUrl,
    });
    setAuthenticatedSession("couple", currentUserId);
  });

  afterEach(() => {
    setSessionRole(null);
  });

  it("generates valid report codes and rejects unsupported characters", () => {
    const code = generateReportAccessCode();
    expect(code).toMatch(/^[0-9]{6}$/);
    expect(isValidReportAccessCode(code)).toBe(true);
    expect(isValidReportAccessCode("REPORT01")).toBe(false);
    expect(isValidReportAccessCode("12345")).toBe(false);
    expect(isValidReportAccessCode("1234567")).toBe(false);
  });

  it("uploads only the generated synthetic file to the private owner path", async () => {
    const file = createSyntheticReportFile();
    const saved = await uploadOwnReport(file, "012345");

    expect(mockedSupabase.storageFrom).toHaveBeenCalledWith(PRIVATE_REPORT_BUCKET);
    expect(mockedSupabase.upload).toHaveBeenCalledWith(
      expect.stringMatching(/^user-a\/[^/]+-rafeeq-synthetic-demo\.txt$/),
      file,
      expect.objectContaining({ contentType: "text/plain", upsert: false }),
    );
    expect(saved).toMatchObject({
      user_id: "user-a",
      access_code: "012345",
      file_name: "rafeeq-synthetic-demo.txt",
      mime_type: "text/plain",
      file_size: file.size,
    });
    expect(saved.object_path.startsWith("user-a/")).toBe(true);
    expect(saved.object_path.split("/")).toHaveLength(2);
  });

  it("rejects user-selected medical files before they reach Storage", async () => {
    const file = new File(["not synthetic"], "screening.pdf", {
      type: "application/pdf",
    });
    await expect(uploadOwnReport(file)).rejects.toThrow(
      "Only RAFEEQ-generated synthetic demonstration files may be uploaded.",
    );
    expect(mockedSupabase.upload).not.toHaveBeenCalled();
  });

  it("rejects synthetic text files larger than the frontend size limit", async () => {
    const oversizedFile = new File(
      [new Uint8Array(MAX_REPORT_SIZE_BYTES + 1)],
      "rafeeq-synthetic-demo.txt",
      { type: "text/plain" },
    );
    await expect(uploadOwnReport(oversizedFile)).rejects.toThrow(
      "Synthetic demo files must be no larger than 10 MB.",
    );
    expect(mockedSupabase.upload).not.toHaveBeenCalled();
  });

  it("lists and downloads only files under the authenticated user's folder", async () => {
    reports.push({
      id: "report-a",
      user_id: "user-a",
      access_code: "012345",
      object_path: "user-a/demo.txt",
      file_name: "demo.txt",
      mime_type: "text/plain",
      file_size: 12,
      created_at: "2026-11-14T12:00:00.000Z",
    });

    await expect(listOwnFiles()).resolves.toMatchObject([{ name: "demo.txt" }]);
    expect(mockedSupabase.list).toHaveBeenCalledWith(
      "user-a",
      expect.objectContaining({ limit: 100, offset: 0 }),
    );
    await expect(downloadOwnFile("user-a/demo.txt")).resolves.toBeInstanceOf(Blob);
    await expect(downloadOwnFile("user-b/demo.txt")).rejects.toThrow(
      "The requested storage path does not belong to your account.",
    );
    expect(mockedSupabase.download).toHaveBeenCalledTimes(1);
  });

  it("scopes code lookup and report listing to the authenticated user", async () => {
    reports.push(
      {
        id: "report-a",
        user_id: "user-a",
        access_code: "012345",
        object_path: "user-a/report-a-demo.txt",
        file_name: "rafeeq-synthetic-demo.txt",
        mime_type: "text/plain",
        file_size: 12,
        created_at: "2026-11-14T12:00:00.000Z",
      },
      {
        id: "report-b",
        user_id: "user-b",
        access_code: "012345",
        object_path: "user-b/report-b-demo.txt",
        file_name: "rafeeq-synthetic-demo.txt",
        mime_type: "text/plain",
        file_size: 12,
        created_at: "2026-11-14T12:00:00.000Z",
      },
    );

    expect(await fetchOwnReports()).toEqual([reports[0]]);
    expect(await findOwnReportByCode("٠١٢٣٤٥")).toEqual(reports[0]);
    expect(filterCalls).toContainEqual(["user_id", "user-a"]);
    expect(filterCalls).toContainEqual(["access_code", "012345"]);
  });

  it("does not create a signed URL for another user's report", async () => {
    reports.push({
      id: "report-b",
      user_id: "user-b",
      access_code: "012345",
      object_path: "user-b/report-b-demo.txt",
      file_name: "rafeeq-synthetic-demo.txt",
      mime_type: "text/plain",
      file_size: 12,
      created_at: "2026-11-14T12:00:00.000Z",
    });

    await expect(createOwnReportSignedUrl("report-b")).rejects.toThrow(
      "The requested report is not available in your account.",
    );
    expect(mockedSupabase.createSignedUrl).not.toHaveBeenCalled();
  });

  it("locks database rows and storage objects to their authenticated owner", () => {
    const migration = readFileSync(
      new URL(
        "../../../../../supabase/migrations/20261114032000_private_screening_reports.sql",
        import.meta.url,
      ),
      "utf8",
    );
    expect(migration).toContain("access_code text not null check (access_code ~ '^[0-9]{6}$')");
    expect(migration).toMatch(
      /create policy screening_reports_select_own[\s\S]*?using \(\(select auth\.uid\(\)\) = user_id\);/,
    );
    expect(migration).toMatch(
      /create policy screening_reports_insert_own[\s\S]*?with check \(\(select auth\.uid\(\)\) = user_id\);/,
    );
    expect(migration).toMatch(
      /create policy screening_reports_delete_own[\s\S]*?using \(\(select auth\.uid\(\)\) = user_id\);/,
    );
    expect(migration).toMatch(
      /create policy report_rafeeq_select_own[\s\S]*?\(storage\.foldername\(name\)\)\[1\] = \(select auth\.uid\(\)\)::text/,
    );
    expect(migration).toMatch(/'report_rafeeq',\s*'report_rafeeq',\s*false/);
    expect(migration).toContain("mime_type text not null check (mime_type = 'text/plain')");
    expect(migration).toMatch(/cardinality\(storage\.foldername\(name\)\) = 1/);
  });
});
