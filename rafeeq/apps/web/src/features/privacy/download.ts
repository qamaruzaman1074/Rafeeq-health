import type { ConsentReceipt } from "@/features/privacy/types";

export type ReceiptFile = {
  filename: string;
  mediaType: "application/json";
  json: string;
};

export function receiptFile(receipt: ConsentReceipt): ReceiptFile {
  return {
    filename: `consent-receipt-${receipt.consent_id}.json`,
    mediaType: "application/json",
    json: `${JSON.stringify(receipt, null, 2)}\n`,
  };
}

export function downloadReceiptFile(file: ReceiptFile): void {
  const blob = new Blob([file.json], { type: file.mediaType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.filename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
