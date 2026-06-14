import type { SupportedCurrency } from "../../../shared/currency/currencies.js";

export interface GetProfileDto {
  id: string;

  name: string;

  email: string;

  preferredCurrency: SupportedCurrency;
}
