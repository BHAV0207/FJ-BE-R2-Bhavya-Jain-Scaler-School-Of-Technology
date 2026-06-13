import type {
  NextFunction,
  Request,
  Response,
} from "express";

import * as transactionService from "./transaction.service.js";

import {
  createTransactionSchema,
} from "./transaction.validation.js";

export async function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto = createTransactionSchema.parse(req.body);

    const response =
      await transactionService.createTransaction(
        req.user.userId,
        dto,
      );

    return res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}