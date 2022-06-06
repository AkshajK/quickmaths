import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import adminCalls from "./apiCalls/adminCalls";
import lobbyCalls from "./apiCalls/lobbyCalls";
import roomCalls from "./apiCalls/roomCalls";

import User from "./models/user";
import Game from "./models/game";
import Level from "./models/level";
import Message from "./models/message";
import Question from "./models/question";
import QuestionType from "./models/questiontype";
import Room from "./models/room";

const router = express.Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req: any, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req: any, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    console.log(`Socket: ${socket}`);
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  } else {
    console.log("Not logged in");
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/joinLobbyPage", lobbyCalls.joinLobbyPage);
router.post("/createRoom", lobbyCalls.createRoom);

router.post("/joinRoomPage", roomCalls.joinRoomPage);
router.post("/startGame", roomCalls.startGame);
router.post("/guess", roomCalls.guess);
router.post("/message", roomCalls.message);

router.post("/newLevel", adminCalls.newLevel);
router.post("/saveLevel", adminCalls.saveLevel);
router.post("/tryCode", adminCalls.tryCode);
router.post("/newQuestionType", adminCalls.newQuestionType);
router.post("/saveQuestionType", adminCalls.saveQuestionType);

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
