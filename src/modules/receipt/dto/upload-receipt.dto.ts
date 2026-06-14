export interface UploadReceiptDto {
  transactionId: string;

  fileName: string;

  fileUrl: string;

  mimeType: string;

  fileSize: number;
}