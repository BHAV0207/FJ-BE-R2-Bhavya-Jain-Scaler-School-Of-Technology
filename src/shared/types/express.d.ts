import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        userId: string;
      };
    }
  }
}

export {};


import type { UserEntity } from "../modules/user/entity/user.entity.js";

declare global {

  namespace Express {

    interface User
      extends UserEntity {}

  }

}

export {};