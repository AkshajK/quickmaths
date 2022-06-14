import { OAuth2Client, TokenPayload } from "google-auth-library";
import { NextFunction, Request, Response } from "express";
import UserModel from "./models/user";
import { User } from "../shared/apiTypes";
const animal = require("cute-animals");
// create a new OAuth client used to verify google sign-in
//    TODO: replace with your own CLIENT_ID
const CLIENT_ID = "180080882825-to464u7earqlme8o2muc5e0bqll8llih.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

const verify = (token: string) => {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
};

// TODO: FIX THE LOGIN!!! THIS IS HACKY!!!
const getOrCreateUser = (token: string, user?: TokenPayload) => {
  return UserModel.findOne({ googleid: user ? user.sub : "nope" }).then(
    (existingUser: User | null | undefined) => {
      if (existingUser !== null && existingUser !== undefined) {
        return existingUser;
      }
      return UserModel.findOne({ cookieToken: token }).then((existingUser2) => {
        if (existingUser2 !== null && existingUser2 !== undefined) {
          if (user && !existingUser2.googleid) {
            existingUser2.googleid = user.sub;
            return existingUser2.save();
          } else if (!user) {
            return existingUser2;
          }
        }
        const newUser = new UserModel({
          name: user ? user.name : animal("adj animal"),
          googleid: user && user.sub,
          cookieToken:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
          roomId: "Lobby",
        });
        return newUser.save();
      });
    }
  );
};

const login = (req: Request, res: Response) => {
  getOrCreateUser(req.body.cookieToken, undefined)
    .then((user) => {
      if (user === null || user === undefined) {
        throw new Error("Unable to retrieve user.");
      }
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to login: ${err}`);
      res.status(401).send({ err });
    });
};

const googleLogin = (req: Request, res: Response) => {
  verify(req.body.token)
    .then((user) => {
      if (user === undefined) return;
      return getOrCreateUser(req.body.cookieToken, user);
    })
    .then((user) => {
      if (user === null || user === undefined) {
        throw new Error("Unable to retrieve user.");
      }
      req.session.user = user;
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to login: ${err}`);
      res.status(401).send({ err });
    });
};

const logout = (req: Request, res: Response) => {
  req.session.user = undefined;
  res.send({});
};

const populateCurrentUser = (req: Request, _res: Response, next: NextFunction) => {
  req.user = req.session.user;
  next();
};

// We use any because
const ensureLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).send({ err: "Not logged in." });
  }
  next();
};

export default {
  ensureLoggedIn,
  populateCurrentUser,
  login,
  googleLogin,
  logout,
};
