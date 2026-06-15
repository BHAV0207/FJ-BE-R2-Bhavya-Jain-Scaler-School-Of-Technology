export function budgetExceededTemplate(
  userName: string,
  category: string,
  budget: number,
  spent: number,
): string {
  const exceededBy = spent - budget;

  return `
  <html>

    <body>

      <h2>Budget Alert</h2>

      <p>Hello ${userName},</p>

      <p>Your budget has been exceeded.</p>

      <table border="1" cellpadding="8">

        <tr>

          <td>Category</td>

          <td>${category}</td>

        </tr>

        <tr>

          <td>Budget</td>

          <td>₹${budget.toFixed(2)}</td>

        </tr>

        <tr>

          <td>Spent</td>

          <td>₹${spent.toFixed(2)}</td>

        </tr>

        <tr>

          <td>Exceeded By</td>

          <td>₹${exceededBy.toFixed(2)}</td>

        </tr>

      </table>

      <br/>

      <p>Please review your spending.</p>

    </body>

  </html>
  `;
}

export function welcomeTemplate(userName: string): string {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1;">Welcome to Personal Finance Tracker!</h2>
        <p>Hello ${userName},</p>
        <p>We're excited to have you on board. Start tracking your transactions, managing your categories, and setting budget goals to take control of your finances.</p>
        <div style="margin: 30px 0; padding: 15px; background-color: #f9fafb; border-left: 4px solid #6366f1;">
          <p style="margin: 0;"><strong>Step 1:</strong> Set up your categories</p>
          <p style="margin: 5px 0 0 0;"><strong>Step 2:</strong> Set your monthly budgets</p>
          <p style="margin: 5px 0 0 0;"><strong>Step 3:</strong> Start logging transactions</p>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Happy tracking!</p>
        <p>Best regards,<br/>The Team</p>
      </div>
    </body>
  </html>
  `;
}
