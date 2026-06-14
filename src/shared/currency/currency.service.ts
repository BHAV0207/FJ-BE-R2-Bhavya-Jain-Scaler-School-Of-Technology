import { EXCHANGE_RATES } from "./exchange-rates.js";

import type { SupportedCurrency } from "./currencies.js";

export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
): number {
  if (from === to) {
    return amount;
  }

  const amountInInr = amount * EXCHANGE_RATES[from];

  const converted = amountInInr / EXCHANGE_RATES[to];

  return Number(converted.toFixed(2));
}
