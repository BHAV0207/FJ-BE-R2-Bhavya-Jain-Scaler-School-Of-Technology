import type { SupportedCurrency } from "./currencies.js";

const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  INR: 1,

  USD: 83.52,

  EUR: 95.31,

  GBP: 111.24,

  CAD: 61.23,

  AUD: 55.45,

  JPY: 0.53,

  CNY: 11.51,
};

export function getExchangeRate(currency: SupportedCurrency): number {
  return EXCHANGE_RATES[currency];
}
