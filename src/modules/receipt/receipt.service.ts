import fs from "fs";
import path from "path";

import { AppError } from "../../shared/errors/AppErrors.js";

import * as receiptRepository from "./receipt.repository.js";
import * as transactionRepository from "../transactions/transaction.repository.js";

import type { UploadReceiptDto } from "./dto/upload-receipt.dto.js";
import type { ReceiptResponseDto } from "./dto/receipt-response.dto.js";

export async function uploadReceipt(
  userId: string,
  dto: UploadReceiptDto,
): Promise<ReceiptResponseDto> {
  const transaction = await transactionRepository.findTransactionById(
    dto.transactionId,
  );

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const existingReceipt = await receiptRepository.findReceiptByTransactionId(
    dto.transactionId,
  );

  if (existingReceipt) {
    throw new AppError("Receipt already exists for this transaction", 409);
  }

  const receipt = await receiptRepository.createReceipt(dto);

  return {
    id: receipt.id,

    transactionId: receipt.transactionId,

    fileName: receipt.fileName,

    fileUrl: receipt.fileUrl,

    mimeType: receipt.mimeType,

    fileSize: receipt.fileSize,

    uploadedAt: receipt.uploadedAt,
  };
}

export async function getReceipt(
  userId: string,
  transactionId: string,
): Promise<ReceiptResponseDto> {
  const transaction =
    await transactionRepository.findTransactionById(transactionId);

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const receipt =
    await receiptRepository.findReceiptByTransactionId(transactionId);

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  return {
    id: receipt.id,

    transactionId: receipt.transactionId,

    fileName: receipt.fileName,

    fileUrl: receipt.fileUrl,

    mimeType: receipt.mimeType,

    fileSize: receipt.fileSize,

    uploadedAt: receipt.uploadedAt,
  };
}

export async function deleteReceipt(
  userId: string,
  receiptId: string,
): Promise<void> {
  const receipt = await receiptRepository.findReceiptById(receiptId);

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  const transaction = await transactionRepository.findTransactionById(
    receipt.transactionId,
  );

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  const absolutePath = path.join(process.cwd(), receipt.fileUrl);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  await receiptRepository.deleteReceipt(receiptId);
}
