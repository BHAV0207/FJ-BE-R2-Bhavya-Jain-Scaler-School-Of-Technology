import * as dashboardRepository from "./dashboard.repository.js";

import type { DashboardResponseDto } from "./dto/dashboard-response.dto.js";

export async function getDashboard(
  userId: string,
): Promise<DashboardResponseDto> {
  const [summary, budget, budgetUsed, recentTransactions, expenseByCategory] =
    await Promise.all([
      dashboardRepository.getDashboardSummary(userId),
      dashboardRepository.getMonthlyBudget(userId),
      dashboardRepository.getCurrentMonthExpense(userId),
      dashboardRepository.getRecentTransactions(userId),
      dashboardRepository.getExpenseByCategory(userId),
    ]);

  const totalIncome = Number(summary.total_income);
  const totalExpense = Number(summary.total_expense);
  const totalRefund = Number(summary.total_refund);

  const monthlyBudget = Number(budget.monthly_budget);
  const currentBudgetUsed = Number(budgetUsed.budget_used);

  const netSavings = totalIncome - totalExpense + totalRefund;

  const budgetRemaining = monthlyBudget - currentBudgetUsed;

  return {
    totalIncome: totalIncome.toFixed(2),

    totalExpense: totalExpense.toFixed(2),

    totalRefund: totalRefund.toFixed(2),

    netSavings: netSavings.toFixed(2),

    monthlyBudget: monthlyBudget.toFixed(2),

    budgetUsed: currentBudgetUsed.toFixed(2),

    budgetRemaining: budgetRemaining.toFixed(2),

    recentTransactions: recentTransactions.map((transaction) => ({
      id: transaction.id,

      amount: transaction.amount,

      transactionType: transaction.transaction_type,

      currency: transaction.currency,

      description: transaction.description,

      transactionDate: transaction.transaction_date,
    })),

    expenseByCategory: expenseByCategory.map((category) => ({
      categoryId: category.id,

      categoryName: category.name,

      totalExpense: category.total,
    })),
  };
}
