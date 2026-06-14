export interface CreateUserDto {
  name: string;

  email: string;

  passwordHash: string | null;

  provider?: "local" | "google";

  googleId?: string | null;
}