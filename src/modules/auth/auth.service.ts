// src/modules/auth/auth.service.ts

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

import * as userRepository from "../user/user.repository.js";

import type { RegisterRequest, AuthResponse } from "./auth.types.js";
import { AppError } from "../../shared/errors/AppErrors.js";

export async function register(input: RegisterRequest): Promise<AuthResponse> {
  // Check if email already exists
  const existingUser = await userRepository.findByEmail(input.email);

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(input.password, 10);

  // Save user
  const user = await userRepository.createUser({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  // Generate JWT
  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  return {
    accessToken,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
