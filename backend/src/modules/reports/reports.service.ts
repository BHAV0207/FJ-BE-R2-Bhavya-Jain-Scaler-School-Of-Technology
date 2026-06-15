import * as reportsRepository from "./reports.repository.js";
import * as userRepository from "../user/user.repository.js";
import { convertFromBaseCurrency } from "../../shared/currency/currency.service.js";
import type { SupportedCurrency } from "../../shared/currency/currencies.js";

async function getPreferredCurrency(userId: string): Promise<SupportedCurrency> {
  const user = await userRepository.getById(userId);
  return (user?.preferredCurrency as SupportedCurrency) || "INR";
}

export async function getSummary(
  userId: string,
) {
  const [summary, preferredCurrency] = await Promise.all([
    reportsRepository.getSummary(userId),
    getPreferredCurrency(userId)
  ]);

  const totalIncome = convertFromBaseCurrency(Number(summary.total_income), preferredCurrency);
  const totalExpense = convertFromBaseCurrency(Number(summary.total_expense), preferredCurrency);
  const totalRefund = convertFromBaseCurrency(Number(summary.total_refund), preferredCurrency);
  
  return {
    totalIncome: totalIncome.toFixed(2),

    totalExpense: totalExpense.toFixed(2),

    totalRefund: totalRefund.toFixed(2),

    netSavings: (
      totalIncome -
      totalExpense +
      totalRefund
    ).toFixed(2),
  };
}

export async function getCategoryWiseReport(
  userId: string,
) {
  const [rows, preferredCurrency] = await Promise.all([
    reportsRepository.getCategoryWiseReport(userId),
    getPreferredCurrency(userId)
  ]);

  return rows.map((row) => ({
    categoryName: row.name,

    totalAmount: convertFromBaseCurrency(Number(row.total), preferredCurrency).toFixed(2),
  }));
}

export async function getMonthlyReport(
  userId: string,
) {
  const [rows, preferredCurrency] = await Promise.all([
    reportsRepository.getMonthlyReport(userId),
    getPreferredCurrency(userId)
  ]);

  return rows.map((row) => ({
    month: row.month,

    income: convertFromBaseCurrency(Number(row.income), preferredCurrency).toFixed(2),

    expense: convertFromBaseCurrency(Number(row.expense), preferredCurrency).toFixed(2),

    refund: convertFromBaseCurrency(Number(row.refund), preferredCurrency).toFixed(2),
  }));
}

export async function getFullReport(
  userId: string,
) {
  const [summary, categoryWise, monthly] = await Promise.all([
    getSummary(userId),
    getCategoryWiseReport(userId),
    getMonthlyReport(userId),
  ]);

  return {
    summary,
    expenseByCategory: categoryWise,
    monthlyTrend: monthly,
  };
}