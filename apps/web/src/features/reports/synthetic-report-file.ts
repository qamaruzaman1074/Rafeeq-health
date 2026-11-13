import { MAX_REPORT_SIZE_BYTES } from "@/features/reports/supabase-storage";

export const SYNTHETIC_REPORT_FILE_NAME = "rafeeq-synthetic-demo.txt";
const SYNTHETIC_REPORT_CONTENT = [
  "RAFEEQ SYNTHETIC DEMONSTRATION FILE",
  "Generated automatically for private storage workflow testing.",
  "This file contains no real genetic, medical, or personal health information.",
].join("\n");

export function createSyntheticReportFile(): File {
  return new File([SYNTHETIC_REPORT_CONTENT], SYNTHETIC_REPORT_FILE_NAME, {
    type: "text/plain",
  });
}

export async function validateSyntheticReportFile(file: File): Promise<void> {
  if (file.type !== "text/plain") {
    throw new Error("Only RAFEEQ-generated synthetic text files are accepted.");
  }
  if (file.size < 1 || file.size > MAX_REPORT_SIZE_BYTES) {
    throw new Error("Synthetic demo files must be no larger than 10 MB.");
  }
  if (
    file.name !== SYNTHETIC_REPORT_FILE_NAME ||
    (await file.text()) !== SYNTHETIC_REPORT_CONTENT
  ) {
    throw new Error("Only RAFEEQ-generated synthetic demonstration files may be uploaded.");
  }
}
