export interface ExpenseByCategoryDto {
  categoryId: string | null;

  categoryName: string | null;

  totalExpense: string;
}

export interface RecentTransactionDto {
  id: string;

  amount: string;

  transactionType: string;

  currency: string;

  description: string | null;

  transactionDate: Date;
}

export interface DashboardResponseDto {
  totalIncome: string;

  totalExpense: string;

  totalRefund: string;

  netSavings: string;

  monthlyBudget: string;

  budgetUsed: string;

  budgetRemaining: string;

  recentTransactions: RecentTransactionDto[];

  expenseByCategory: ExpenseByCategoryDto[];
}