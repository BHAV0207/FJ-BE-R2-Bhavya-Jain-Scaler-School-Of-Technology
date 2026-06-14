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
