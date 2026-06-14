import { JwtPayload } from "jsonwebtoken";
import type { User} from "../modules/user/entity/user.entity.js";

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


declare global {
  namespace Express {
    interface User
      extends User {}
  }
}

export {};