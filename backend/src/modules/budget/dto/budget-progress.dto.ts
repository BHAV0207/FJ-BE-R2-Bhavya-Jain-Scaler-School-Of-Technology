export interface BudgetProgressDto {
  id: string;

  categoryId: string;

  categoryName: string;

  amount: string;

  budgetPeriod: Date;

  spent: string;

  remaining: string;

  percentageUsed: number;

  isOverBudget: boolean;

  notificationSent: boolean;
}