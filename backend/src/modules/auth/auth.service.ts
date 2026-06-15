import bcrypt from "bcrypt";
import { AppError } from "../../shared/errors/AppErrors.js";

import * as userRepository from "../user/user.repository.js";
import type { RegisterRequestDto } from "./dto/register-request.dto.js";
import type { AuthResponseDto } from "./dto/auth-response.dto.js";
import type { LoginRequestDto } from "./dto/login-request.dto.js";
import { GenerateAccessToken } from "../../shared/security/token.service.js";


export async function register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
  // Check if email already exists
  const existingUser = await userRepository.findByEmail(dto.email);

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(dto.password, 10);

  // Save user
  const user = await userRepository.createUser({
    name: dto.name,
    email: dto.email,
    passwordHash,
  });

  // Generate JWT
  const accessToken = GenerateAccessToken(user.id);

  return {
    accessToken,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export async function login(dto:LoginRequestDto) : Promise<AuthResponseDto> {

  const user = await userRepository.findByEmail(dto.email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.passwordHash) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    dto.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = GenerateAccessToken(user.id);

  return {
    accessToken,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
} 
