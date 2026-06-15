import * as dashboardRepository from "./dashboard.repository.js";

import type {
  DashboardResponseDto,
} from "./dto/dashboard-response.dto.js";

function toNumber(
  value: string | number | null,
): number {
  return Number(value ?? 0);
}

export async function getDashboard(
  userId: string,
): Promise<DashboardResponseDto> {
  const [
    summary,
    monthlyBudget,
    budgetUsed,
    recentTransactions,
    expenseByCategory,
    monthlyTrend,
  ] = await Promise.all([
    dashboardRepository.getDashboardSummary(userId),

    dashboardRepository.getMonthlyBudget(userId),

    dashboardRepository.getCurrentMonthExpense(userId),

    dashboardRepository.getRecentTransactions(userId),

    dashboardRepository.getExpenseByCategory(userId),

    dashboardRepository.getMonthlyTrend(userId),
  ]);

  const totalIncome = toNumber(
    summary.total_income,
  );

  const totalExpense = toNumber(
    summary.total_expense,
  );

  const totalRefund = toNumber(
    summary.total_refund,
  );

  const budget = toNumber(
    monthlyBudget.monthly_budget,
  );

  const spent = toNumber(
    budgetUsed.budget_used,
  );

  const netSavings =
    totalIncome -
    totalExpense +
    totalRefund;

  const budgetRemaining =
    budget - spent;

  const savingRate =
    totalIncome === 0
      ? 0
      : Number(
          (
            (netSavings /
              totalIncome) *
            100
          ).toFixed(2),
        );

  const budgetPercentage =
    budget === 0
      ? 0
      : Number(
          (
            (spent / budget) *
            100
          ).toFixed(2),
        );

  const isOverBudget =
    spent > budget;

  return {
    summary: {
      totalIncome:
        totalIncome.toFixed(2),

      totalExpense:
        totalExpense.toFixed(2),

      totalRefund:
        totalRefund.toFixed(2),

      netSavings:
        netSavings.toFixed(2),

      savingRate,
    },

    budget: {
      monthlyBudget:
        budget.toFixed(2),

      budgetUsed:
        spent.toFixed(2),

      budgetRemaining:
        budgetRemaining.toFixed(2),

      budgetPercentage,

      isOverBudget,
    },

    recentTransactions:
      recentTransactions.map(
        (transaction) => ({
          id: transaction.id,

          amount:
            transaction.amount,

          transactionType:
            transaction.transaction_type,

          currency:
            transaction.currency,

          description:
            transaction.description,

          transactionDate:
            transaction.transaction_date,
        }),
      ),

    expenseByCategory:
      expenseByCategory.map(
        (category) => ({
          categoryId:
            category.id,

          categoryName:
            category.name,

          totalExpense:
            category.total,
        }),
      ),

    monthlyTrend:
      monthlyTrend.map(
        (month) => ({
          month: month.month,

          income:
            month.income,

          expense:
            month.expense,
        }),
      ),
  };
}