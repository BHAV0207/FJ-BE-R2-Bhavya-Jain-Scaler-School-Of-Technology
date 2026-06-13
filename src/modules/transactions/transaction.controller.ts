import type {
  NextFunction,
  Request,
  Response,
} from "express";

import * as transactionService from "./transaction.service.js";

import {
  createTransactionSchema,
  getTransactionsSchema,
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

export async function getTransactions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto =
      getTransactionsSchema.parse(req.query);

    const response =
      await transactionService.getTransactions(
        req.user.userId,
        dto,
      );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}