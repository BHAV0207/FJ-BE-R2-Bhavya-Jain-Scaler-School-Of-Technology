import type { SupportedCurrency } from "../../../shared/currency/currencies.js";

export interface UpdateUserDto {
  name?: string | undefined;

  email?: string | undefined;

  preferredCurrency?: SupportedCurrency | undefined;
}
