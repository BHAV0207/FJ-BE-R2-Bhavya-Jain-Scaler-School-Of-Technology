export interface ReceiptResponseDto {
  id: string;

  transactionId: string;

  fileName: string;

  fileUrl: string;

  mimeType: string;

  fileSize: number;

  uploadedAt: Date;
}