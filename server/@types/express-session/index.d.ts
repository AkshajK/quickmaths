import { User } from "../../models/user";
declare module "express-session" {
  interface Session {
    user?: User;
  }
}
