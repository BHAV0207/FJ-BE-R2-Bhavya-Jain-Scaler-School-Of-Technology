export interface User{
  id: string;

  name: string;

  email: string;

  passwordHash: string | null;

  provider: "local" | "google";

  googleId: string | null;

  createdAt: Date;

  updatedAt: Date;
}