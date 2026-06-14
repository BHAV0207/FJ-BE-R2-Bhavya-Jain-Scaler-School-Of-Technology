import * as budgetRepository from "./budget.repository.js";

import * as userRepository from "../user/user.repository.js";

import {
  sendEmail,
} from "../../shared/email/email.service.js";

import {
  budgetExceededTemplate,
} from "../../shared/email/email.templates.js";

export async function checkBudgetNotification(
  userId: string,
) {

  const progress =
    await budgetRepository.getBudgetProgress(
      userId,
    );

  const user =
    await userRepository.findById(
      userId,
    );

  if (!user) {
    return;
  }

  for (const budget of progress) {

    if (
      Number(budget.spent)
      >
      Number(budget.budget)
    ) {

      await sendEmail(

        user.email,

        "Budget Exceeded",

        budgetExceededTemplate(

          user.name,

          budget.category_name,

          Number(budget.budget),

          Number(budget.spent),
        ),
      );
    }
  }
}