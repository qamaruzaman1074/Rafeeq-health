import { supabase } from "@/utils/supabase";

export const REPORT_STORAGE_BUCKET = "report_rafeeq";
export const MAX_REPORT_SIZE_BYTES = 10 * 1024 * 1024;
const STORAGE_LIST_PAGE_SIZE = 100;
const SIGNED_URL_LIFETIME_SECONDS = 60;

async function authenticatedUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  if (data.user === null) {
    throw new Error("Report storage requires an authenticated Supabase account.");
  }
  return data.user.id;
}

function assertOwnedPath(userId: string, objectPath: string): void {
  const prefix = `${userId}/`;
  const fileName = objectPath.startsWith(prefix) ? objectPath.slice(prefix.length) : "";
  if (fileName.length === 0 || fileName.includes("/")) {
    throw new Error("The requested storage path does not belong to your account.");
  }
}

function safeObjectFileName(fileName: string): string {
  const safeName = fileName
    .split(/[\\/]/)
    .pop()
    ?.replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
  if (safeName === undefined || safeName.length === 0 || safeName === "." || safeName === "..") {
    throw new Error("The storage filename is invalid.");
  }
  return safeName;
}

async function listStoragePage(userId: string, offset: number) {
  const { data, error } = await supabase.storage
    .from(REPORT_STORAGE_BUCKET)
    .list(userId, {
      limit: STORAGE_LIST_PAGE_SIZE,
      offset,
      sortBy: { column: "created_at", order: "desc" },
    });
  if (error) {
    throw error;
  }
  return data;
}

export async function uploadOwnFile(file: File, fileName: string): Promise<string> {
  const userId = await authenticatedUserId();
  const objectName = safeObjectFileName(fileName);
  const objectPath = `${userId}/${objectName}`;
  const { error } = await supabase.storage.from(REPORT_STORAGE_BUCKET).upload(objectPath, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) {
    throw error;
  }
  return objectPath;
}

export async function listOwnFiles() {
  const userId = await authenticatedUserId();
  const files: Awaited<ReturnType<typeof listStoragePage>> = [];
  for (let offset = 0; ; offset += STORAGE_LIST_PAGE_SIZE) {
    const page = await listStoragePage(userId, offset);
    files.push(...page);
    if (page.length < STORAGE_LIST_PAGE_SIZE) {
      return files;
    }
  }
}

export async function downloadOwnFile(objectPath: string): Promise<Blob> {
  const userId = await authenticatedUserId();
  assertOwnedPath(userId, objectPath);
  const { data, error } = await supabase.storage
    .from(REPORT_STORAGE_BUCKET)
    .download(objectPath);
  if (error) {
    throw error;
  }
  return data;
}

export async function createOwnFileSignedUrl(
  objectPath: string,
  downloadName: string,
): Promise<string> {
  const userId = await authenticatedUserId();
  assertOwnedPath(userId, objectPath);
  const { data, error } = await supabase.storage
    .from(REPORT_STORAGE_BUCKET)
    .createSignedUrl(objectPath, SIGNED_URL_LIFETIME_SECONDS, { download: downloadName });
  if (error) {
    throw error;
  }
  return data.signedUrl;
}

export async function deleteOwnFile(objectPath: string): Promise<void> {
  const userId = await authenticatedUserId();
  assertOwnedPath(userId, objectPath);
  const { error } = await supabase.storage.from(REPORT_STORAGE_BUCKET).remove([objectPath]);
  if (error) {
    throw error;
  }
}
