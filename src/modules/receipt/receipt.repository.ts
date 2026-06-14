import { pool } from "../../database/pool.js";

import type { ReceiptEntity } from "./entity/receipt.entity.js";
import type { UploadReceiptDto } from "./dto/upload-receipt.dto.js";

export async function createReceipt(
  dto: UploadReceiptDto,
): Promise<ReceiptEntity> {
  const result = await pool.query(
    `
    INSERT INTO receipts (
      transaction_id,
      file_name,
      file_url,
      mime_type,
      file_size
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5
    )
    RETURNING
      id,
      transaction_id,
      file_name,
      file_url,
      mime_type,
      file_size,
      uploaded_at
    `,
    [dto.transactionId, dto.fileName, dto.fileUrl, dto.mimeType, dto.fileSize],
  );

  const row = result.rows[0];

  return {
    id: row.id,
    transactionId: row.transaction_id,
    fileName: row.file_name,
    fileUrl: row.file_url,
    mimeType: row.mime_type,
    fileSize: Number(row.file_size),
    uploadedAt: row.uploaded_at,
  };
}

export async function findReceiptById(
  receiptId: string,
): Promise<ReceiptEntity | null> {
  const result = await pool.query(
    `
    SELECT
      id,
      transaction_id,
      file_name,
      file_url,
      mime_type,
      file_size,
      uploaded_at
    FROM receipts
    WHERE id = $1
    `,
    [receiptId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    transactionId: row.transaction_id,
    fileName: row.file_name,
    fileUrl: row.file_url,
    mimeType: row.mime_type,
    fileSize: Number(row.file_size),
    uploadedAt: row.uploaded_at,
  };
}

export async function findReceiptByTransactionId(
  transactionId: string,
): Promise<ReceiptEntity | null> {
  const result = await pool.query(
    `
    SELECT
      id,
      transaction_id,
      file_name,
      file_url,
      mime_type,
      file_size,
      uploaded_at
    FROM receipts
    WHERE transaction_id = $1
    `,
    [transactionId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id,
    transactionId: row.transaction_id,
    fileName: row.file_name,
    fileUrl: row.file_url,
    mimeType: row.mime_type,
    fileSize: Number(row.file_size),
    uploadedAt: row.uploaded_at,
  };
}

export async function deleteReceipt(receiptId: string): Promise<void> {
  await pool.query(
    `
    DELETE FROM receipts
    WHERE id = $1
    `,
    [receiptId],
  );
}

export async function receiptExists(transactionId: string): Promise<boolean> {
  const result = await pool.query(
    `
    SELECT EXISTS(
      SELECT 1
      FROM receipts
      WHERE transaction_id = $1
    ) AS exists
    `,
    [transactionId],
  );

  return result.rows[0].exists;
}
