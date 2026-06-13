export interface CategoryEntity {
  id: string;

  name: string;

  type: "income" | "expense";

  isSystem: boolean;

  userId: string | null;

  createdAt: Date;
}