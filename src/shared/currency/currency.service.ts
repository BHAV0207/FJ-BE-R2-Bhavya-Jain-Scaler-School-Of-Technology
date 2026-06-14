import { getExchangeRate } from "./exchange-rate.service.js";

import type { SupportedCurrency } from "./currencies.js";

export function convertToBaseCurrency(
  amount: number,
  currency: SupportedCurrency,
): {
  exchangeRate: number;

  baseAmount: number;
} {
  const exchangeRate = getExchangeRate(currency);

  return {
    exchangeRate,

    baseAmount: Number((amount * exchangeRate).toFixed(2)),
  };
}

export function convertFromBaseCurrency(
  baseAmount: number,
  currency: SupportedCurrency,
): number {
  const exchangeRate = getExchangeRate(currency);

  return Number((baseAmount / exchangeRate).toFixed(2));
}
