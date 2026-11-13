export const REPORT_CODE_LENGTH = 6;

const REPORT_CODE_PATTERN = new RegExp(`^[0-9]{${REPORT_CODE_LENGTH}}$`);
const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function normalizeReportAccessCode(value: string): string {
  return value
    .trim()
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_INDIC_DIGITS.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)));
}

export function sanitizeReportAccessCodeInput(value: string): string {
  return normalizeReportAccessCode(value).replace(/[^0-9]/g, "").slice(0, REPORT_CODE_LENGTH);
}

export function isValidReportAccessCode(value: string): boolean {
  return REPORT_CODE_PATTERN.test(normalizeReportAccessCode(value));
}

export function generateReportAccessCode(): string {
  const digits: string[] = [];
  while (digits.length < REPORT_CODE_LENGTH) {
    const bytes = globalThis.crypto.getRandomValues(
      new Uint8Array(REPORT_CODE_LENGTH - digits.length),
    );
    for (const byte of bytes) {
      if (byte < 250) {
        digits.push(String(byte % 10));
      }
      if (digits.length === REPORT_CODE_LENGTH) {
        break;
      }
    }
  }
  return digits.join("");
}
