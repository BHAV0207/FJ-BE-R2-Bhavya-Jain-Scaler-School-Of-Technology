import type { Request, Response } from "express";
import * as transactionService from "./transaction.service.js";
import {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionsSchema,
} from "./transaction.validation.js";
import { asyncHandler } from "../../shared/errors/asyncHandler.js";

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const dto = createTransactionSchema.parse(req.body);
  const response = await transactionService.createTransaction(
    req.user!.id,
    dto as any,
  );
  return res.status(201).json({
    success: true,
    data: response,
  });
});

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const dto = getTransactionsSchema.parse(req.query);
  const response = await transactionService.getTransactions(
    req.user!.id,
    dto,
  );
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const response = await transactionService.getTransactionById(
    req.user!.id,
    req.params.id as string,
  );
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const dto = updateTransactionSchema.parse(req.body);
  const response = await transactionService.updateTransaction(
    req.user!.id,
    req.params.id as string,
    dto as any,
  );
  return res.status(200).json({
    success: true,
    data: response,
  });
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  await transactionService.deleteTransaction(
    req.user!.id,
    req.params.id as string,
  );
  return res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
  });
});