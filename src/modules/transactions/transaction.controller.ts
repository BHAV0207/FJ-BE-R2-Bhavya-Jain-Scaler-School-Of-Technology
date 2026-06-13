import type {
  NextFunction,
  Request,
  Response,
} from "express";

import * as transactionService from "./transaction.service.js";

import {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsSchema,
} from "./transaction.validation.js";

export async function createTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto =
      createTransactionSchema.parse(req.body);

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

export async function getTransactionById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const response =
      await transactionService.getTransactionById(
        req.user.userId,
        req.params.id,
      );

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const dto =
      updateTransactionSchema.parse(
        req.body,
      );

    const response =
      await transactionService.updateTransaction(
        req.user.userId,
        req.params.id,
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

export async function deleteTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await transactionService.deleteTransaction(
      req.user.userId,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      message:
        "Transaction deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}