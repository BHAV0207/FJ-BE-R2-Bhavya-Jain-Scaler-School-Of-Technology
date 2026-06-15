export interface BudgetEntity {
  id: string;

  userId: string;

  categoryId: string;

  amount: string;

  budgetPeriod: Date;

  createdAt: Date;
}