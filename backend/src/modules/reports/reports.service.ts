import * as reportsRepository from "./reports.repository.js";

export async function getSummary(
  userId: string,
) {
  const summary =
    await reportsRepository.getSummary(
      userId,
    );

  return {
    totalIncome: summary.total_income,

    totalExpense: summary.total_expense,

    totalRefund: summary.total_refund,

    netSavings: (
      Number(summary.total_income) -
      Number(summary.total_expense) +
      Number(summary.total_refund)
    ).toFixed(2),
  };
}

export async function getCategoryWiseReport(
  userId: string,
) {
  const rows =
    await reportsRepository.getCategoryWiseReport(
      userId,
    );

  return rows.map((row) => ({
    categoryName: row.name,

    totalExpense: row.total,
  }));
}

export async function getMonthlyReport(
  userId: string,
) {
  const rows =
    await reportsRepository.getMonthlyReport(
      userId,
    );

  return rows.map((row) => ({
    month: row.month,

    income: row.income,

    expense: row.expense,

    refund: row.refund,
  }));
}