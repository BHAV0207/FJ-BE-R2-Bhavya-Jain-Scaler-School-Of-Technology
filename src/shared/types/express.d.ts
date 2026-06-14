import { User as UserEntity } from "../../modules/user/entity/user.entity.js";

declare global {
  namespace Express {
    interface User extends UserEntity {}
    interface Request {
      user?: User;
    }
  }
}

export {};
