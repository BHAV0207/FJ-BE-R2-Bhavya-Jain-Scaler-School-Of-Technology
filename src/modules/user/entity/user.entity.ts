import type {
  SupportedCurrency,
} from "../../../shared/currency/currencies.js";

export interface User {
  id: string;

  name: string;

  email: string;

  passwordHash: string | null;

  provider: "local" | "google";

  googleId: string | null;

  preferredCurrency: SupportedCurrency;

  createdAt: Date;

  updatedAt: Date;
}