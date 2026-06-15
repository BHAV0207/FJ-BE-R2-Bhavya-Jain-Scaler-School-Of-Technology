import type { NextFunction, Request, Response } from "express";

import * as receiptService from "./receipt.service.js";

import { uploadReceiptSchema } from "./receipt.validation.js";

export async function uploadReceipt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) {
      throw new Error("Receipt file is required");
    }

    const body = uploadReceiptSchema.parse({
      transactionId: req.body.transactionId,
    });

    const response = await receiptService.uploadReceipt(req.user!.id, {
      transactionId: body.transactionId,

      fileName: req.file.originalname,

      fileUrl: req.file.path.replace(/\\/g, "/"),

      mimeType: req.file.mimetype,

      fileSize: req.file.size,
    });

    return res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getReceipt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response = await receiptService.getReceipt(
      req.user!.id,
      req.params.transactionId as string,
    );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteReceipt(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await receiptService.deleteReceipt(req.user!.id, req.params.id as string);

    return res.status(200).json({
      success: true,
      message: "Receipt deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}
