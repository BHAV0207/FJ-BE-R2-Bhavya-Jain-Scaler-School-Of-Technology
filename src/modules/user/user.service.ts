import { AppError } from "../../shared/errors/AppErrors.js";
import type { UpdateUserDto } from "./dto/update-user.dto.js";
import type { GetProfileDto } from "./dto/user-profile.dto.js";
import { getById } from "./user.repository.js";
import * as userRepository from "./user.repository.js";

export async function getProfile(userId: string): Promise<GetProfileDto> {
  const user = await getById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    preferredCurrency: user.preferredCurrency,
  };
}


export async function updateProfile(
  userId: string,
  dto: UpdateUserDto,
): Promise<GetProfileDto> {
  const user = await userRepository.getById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  const updatedUser =
    await userRepository.updateUser(
      userId,
      dto,
    );

  return {
    id: updatedUser.id,

    name: updatedUser.name,

    email: updatedUser.email,

    preferredCurrency:
      updatedUser.preferredCurrency,
  };
}
