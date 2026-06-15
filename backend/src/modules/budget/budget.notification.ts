import * as budgetRepository from "./budget.repository.js";
import * as userRepository from "../user/user.repository.js";

import { sendEmail } from "../../shared/email/email.service.js";

import { budgetExceededTemplate } from "../../shared/email/email.templates.js";

export async function notifyBudgetExceeded(progress: any, userId: string) {
  const budget = Number(progress.budget);

  const spent = Number(progress.spent);

  if (spent <= budget) {
    return;
  }

  if (progress.notification_sent) {
    return;
  }

  const user = await userRepository.getById(userId);

  if (!user) {
    return;
  }

  await sendEmail(
    user.email,

    "Budget Exceeded",

    budgetExceededTemplate(
      user.name,

      progress.category_name,

      Number(progress.budget),

      Number(progress.spent),
    ),
  );

  await budgetRepository.markNotificationSent(progress.budget_id);
}
