import { AppError } from "../../shared/errors/AppErrors.js";
import type { UpdateUserDto } from "./dto/update-user.dto.js";
import type { UserProfileDto } from "./dto/user-profile.dto.js";
import { getById } from "./user.repository.js";
import * as userRepository from "./user.repository.js";

export async function getProfile(userId: string): Promise<UserProfileDto> {
  const user = await getById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function updateProfile(
  userId: string,
  dto: UpdateUserDto,
): Promise<UserProfileDto> {
  const existingUser = await userRepository.getById(userId);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  if (dto.email && dto.email !== existingUser.email) {
    const duplicate = await userRepository.findByEmail(dto.email);

    if (duplicate) {
      throw new AppError("Email already exists", 409);
    }
  }

  const updatedUser = await userRepository.updateUser(userId, dto);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
  };
}
