export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CNY: '¥',
};

export const CURRENCY_CODES = Object.keys(CURRENCY_SYMBOLS);

export function getCurrencySymbol(code: string): string {
  return CURRENCY_SYMBOLS[code] ?? code;
}

/**
 * Format a numeric or string amount with the given currency's symbol.
 * e.g. formatAmount(1234.5, 'INR') => '₹1,235'
 */
export function formatAmount(amount: number | string, currency: string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${getCurrencySymbol(currency)}0`;
  return `${getCurrencySymbol(currency)}${num.toLocaleString()}`;
}
