export function budgetExceededTemplate(
  name: string,
  category: string,
  budget: number,
  spent: number,
) {

  return `

    <h2>Budget Alert</h2>

    <p>Hello ${name},</p>

    <p>You have exceeded your budget.</p>

    <ul>

      <li>Category: ${category}</li>

      <li>Budget: ₹${budget}</li>

      <li>Spent: ₹${spent}</li>

    </ul>

  `;
}