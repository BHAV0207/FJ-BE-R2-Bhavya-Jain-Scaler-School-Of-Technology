export interface SummaryDto {
  totalIncome: string;

  totalExpense: string;

  totalRefund: string;

  netSavings: string;

  savingRate: number;
}

export interface BudgetSummaryDto {
  monthlyBudget: string;

  budgetUsed: string;

  budgetRemaining: string;

  budgetPercentage: number;

  isOverBudget: boolean;
}

export interface RecentTransactionDto {
  id: string;

  amount: string;

  transactionType: string;

  currency: string;

  description: string | null;

  transactionDate: Date;
}

export interface ExpenseByCategoryDto {
  categoryId: string | null;

  categoryName: string | null;

  totalExpense: string;
}

export interface MonthlyTrendDto {
  month: string;

  income: string;

  expense: string;
}

export interface DashboardResponseDto {
  summary: SummaryDto;

  budget: BudgetSummaryDto;

  recentTransactions: RecentTransactionDto[];

  expenseByCategory: ExpenseByCategoryDto[];

  monthlyTrend: MonthlyTrendDto[];
}