import cron from "node-cron";

import * as budgetRepository from "../../modules/budget/budget.repository.js";

import { notifyBudgetExceeded } from "../../modules/budget/budget.notification.js";

export function startBudgetNotificationJob() {
  cron.schedule(
    "0 9 * * *",

    async () => {
      const budgets = await budgetRepository.getAllBudgetProgress();

      await Promise.all(
        budgets.map((budget) => notifyBudgetExceeded(budget, budget.user_id)),
      );
    },
  );
}
