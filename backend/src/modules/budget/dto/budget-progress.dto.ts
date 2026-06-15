export interface BudgetProgressDto {
  categoryId: string;

  categoryName: string;

  budget: string;

  spent: string;

  remaining: string;

  percentageUsed: number;

  isOverBudget: boolean;

  notificationSent: boolean;
}