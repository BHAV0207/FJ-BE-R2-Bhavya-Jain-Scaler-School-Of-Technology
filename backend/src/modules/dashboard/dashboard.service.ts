import * as dashboardRepository from "./dashboard.repository.js";
import * as userRepository from "../user/user.repository.js";
import { convertFromBaseCurrency } from "../../shared/currency/currency.service.js";
import type { SupportedCurrency } from "../../shared/currency/currencies.js";

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
    user,
    summary,
    monthlyBudget,
    budgetUsed,
    recentTransactions,
    expenseByCategory,
    monthlyTrend,
    weeklyTrend,
  ] = await Promise.all([
    userRepository.getById(userId),

    dashboardRepository.getDashboardSummary(userId),

    dashboardRepository.getMonthlyBudget(userId),

    dashboardRepository.getCurrentMonthExpense(userId),

    dashboardRepository.getRecentTransactions(userId),

    dashboardRepository.getExpenseByCategory(userId),

    dashboardRepository.getMonthlyTrend(userId),

    dashboardRepository.getWeeklyTrend(userId),
  ]);

  const preferredCurrency = (user?.preferredCurrency as SupportedCurrency) || "INR";

  const totalIncome = convertFromBaseCurrency(
    toNumber(summary.total_income),
    preferredCurrency
  );

  const totalExpense = convertFromBaseCurrency(
    toNumber(summary.total_expense),
    preferredCurrency
  );

  const totalRefund = convertFromBaseCurrency(
    toNumber(summary.total_refund),
    preferredCurrency
  );

  const budget = convertFromBaseCurrency(
    toNumber(monthlyBudget.monthly_budget),
    preferredCurrency
  );

  const spent = convertFromBaseCurrency(
    toNumber(budgetUsed.budget_used),
    preferredCurrency
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
        (transaction: any) => ({
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
        (category: any) => ({
          categoryId:
            category.id,

          categoryName:
            category.name,

          totalExpense:
            convertFromBaseCurrency(toNumber(category.total), preferredCurrency).toFixed(2),
        }),
      ),

    monthlyTrend:
      monthlyTrend.map(
        (month: any) => ({
          month: month.month,

          income:
            convertFromBaseCurrency(toNumber(month.income), preferredCurrency).toFixed(2),

          expense:
            convertFromBaseCurrency(toNumber(month.expense), preferredCurrency).toFixed(2),
        }),
      ),

    weeklyTrend:
      weeklyTrend.map(
        (week: any) => ({
          name: week.name,
          income: convertFromBaseCurrency(week.income, preferredCurrency),
          expense: convertFromBaseCurrency(week.expense, preferredCurrency),
        })
      ),
  } as any;
}