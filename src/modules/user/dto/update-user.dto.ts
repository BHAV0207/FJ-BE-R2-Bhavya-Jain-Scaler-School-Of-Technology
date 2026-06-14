import type { SupportedCurrency } from "../../../shared/currency/currencies.js";

export interface UpdateUserDto {
  name?: string;

  preferredCurrency?: SupportedCurrency;
}
