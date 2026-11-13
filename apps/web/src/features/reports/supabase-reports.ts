import { supabase, type Database } from "@/utils/supabase";
import {
  generateReportAccessCode,
  isValidReportAccessCode,
  normalizeReportAccessCode,
} from "@/features/report-access/report-code";
export { generateReportAccessCode, isValidReportAccessCode };
import {
  createOwnFileSignedUrl,
  deleteOwnFile,
  listOwnFiles,
  REPORT_STORAGE_BUCKET,
  uploadOwnFile,
} from "@/features/reports/supabase-storage";
import { validateSyntheticReportFile } from "@/features/reports/synthetic-report-file";

export { MAX_REPORT_SIZE_BYTES } from "@/features/reports/supabase-storage";
export type ScreeningReport = Database["public"]["Tables"]["screening_reports"]["Row"];

export const PRIVATE_REPORT_BUCKET = REPORT_STORAGE_BUCKET;
const REPORT_SELECT =
  "id, user_id, access_code, object_path, file_name, mime_type, file_size, created_at";

async function authenticatedUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  if (data.user === null) {
    throw new Error("Report upload requires an authenticated Supabase account.");
  }
  return data.user.id;
}

function safeFileName(fileName: string): string {
  const withoutPath = fileName.split(/[\\/]/).pop() ?? "";
  const safeName = Array.from(withoutPath)
    .filter((character) => {
      const codePoint = character.codePointAt(0);
      return codePoint !== undefined && codePoint > 0x1f && codePoint !== 0x7f;
    })
    .join("")
    .trim();
  if (safeName.length === 0 || safeName.length > 255) {
    throw new Error("The report filename must contain 1 to 255 characters.");
  }
  return safeName;
}

export async function fetchOwnReports(): Promise<ScreeningReport[]> {
  const userId = await authenticatedUserId();
  const [files, reportResult] = await Promise.all([
    listOwnFiles(),
    supabase
      .from("screening_reports")
      .select(REPORT_SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);
  if (reportResult.error) {
    throw reportResult.error;
  }
  const storedNames = new Set(files.map((file) => file.name));
  const ownerPrefix = `${userId}/`;
  return reportResult.data.filter(
    (report) =>
      report.object_path.startsWith(ownerPrefix) &&
      storedNames.has(report.object_path.slice(ownerPrefix.length)),
  );
}

export async function findOwnReportByCode(code: string): Promise<ScreeningReport | null> {
  const normalizedCode = normalizeReportAccessCode(code);
  if (!isValidReportAccessCode(normalizedCode)) {
    throw new Error("Report access codes must contain exactly 6 digits.");
  }
  const userId = await authenticatedUserId();
  const { data, error } = await supabase
    .from("screening_reports")
    .select(REPORT_SELECT)
    .eq("user_id", userId)
    .eq("access_code", normalizedCode)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data;
}

export async function uploadOwnReport(
  file: File,
  requestedCode?: string,
): Promise<ScreeningReport> {
  await validateSyntheticReportFile(file);
  const fileName = safeFileName(file.name);
  const accessCode =
    requestedCode === undefined || requestedCode.trim().length === 0
      ? generateReportAccessCode()
      : normalizeReportAccessCode(requestedCode);
  if (!isValidReportAccessCode(accessCode)) {
    throw new Error("Report access codes must contain exactly 6 digits.");
  }

  const userId = await authenticatedUserId();
  const reportId = globalThis.crypto.randomUUID();
  const objectPath = await uploadOwnFile(file, `${reportId}-${fileName}`);

  const { data, error } = await supabase
    .from("screening_reports")
    .insert({
      id: reportId,
      access_code: accessCode,
      object_path: objectPath,
      file_name: fileName,
      mime_type: file.type,
      file_size: file.size,
    })
    .select(REPORT_SELECT)
    .maybeSingle();

  if (error || data === null) {
    try {
      await deleteOwnFile(objectPath);
    } catch (cleanupError) {
      const insertMessage = error?.message ?? "The report record was not returned.";
      const cleanupMessage = cleanupError instanceof Error
        ? cleanupError.message
        : "The uploaded file could not be removed.";
      throw new Error(
        `The report record could not be saved (${insertMessage}), and the uploaded file could not be removed (${cleanupMessage}).`,
      );
    }
    if (error) {
      throw error;
    }
    throw new Error("The report record was not saved.");
  }
  return data;
}

export async function createOwnReportSignedUrl(reportId: string): Promise<string> {
  const userId = await authenticatedUserId();
  const { data, error } = await supabase
    .from("screening_reports")
    .select("object_path, file_name")
    .eq("user_id", userId)
    .eq("id", reportId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (data === null) {
    throw new Error("The requested report is not available in your account.");
  }
  if (!data.object_path.startsWith(`${userId}/`)) {
    throw new Error("The report storage path does not belong to your account.");
  }

  return createOwnFileSignedUrl(data.object_path, data.file_name);
}

export async function deleteOwnReport(reportId: string): Promise<boolean> {
  const userId = await authenticatedUserId();
  const { data, error } = await supabase
    .from("screening_reports")
    .select("id, object_path")
    .eq("user_id", userId)
    .eq("id", reportId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (data === null) {
    return false;
  }
  if (!data.object_path.startsWith(`${userId}/`)) {
    throw new Error("The report storage path does not belong to your account.");
  }

  await deleteOwnFile(data.object_path);

  const { data: deleted, error: deleteError } = await supabase
    .from("screening_reports")
    .delete()
    .eq("user_id", userId)
    .eq("id", reportId)
    .select("id")
    .maybeSingle();
  if (deleteError) {
    throw deleteError;
  }
  return deleted !== null;
}
