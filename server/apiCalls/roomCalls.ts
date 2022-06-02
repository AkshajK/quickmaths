import User from "../../shared/user";
import Game from "../../shared/game";
import Level from "../../shared/level";
import Message from "../../shared/message";
import Question from "../../shared/question";
import QuestionType from "../../shared/questiontype";
import Room from "../../shared/room";

var _ = require("lodash");

import {
  TypedRequestBody,
  TypedResponse,
  guessRequestBodyType,
  guessResponseType,
  joinRoomPageRequestBodyType,
  joinRoomPageResponseType,
  joinRoomPageSocketEmitType,
  messageRequestBodyType,
  messageResponseType,
  startGameRequestBodyType,
  startGameResponseType,
  lock,
  messageSocketEmitType,
} from "../../shared/apiTypes";
import UserModel from "../models/user";
import RoomModel from "../models/room";
import GameModel from "../models/game";
import LevelModel from "../models/level";
import QuestionModel from "../models/question";
import MessageModel from "../models/message";
import socketManager from "../server-socket";
import e from "express";

const joinRoomPage = async (
  req: TypedRequestBody<joinRoomPageRequestBodyType>,
  res: TypedResponse<joinRoomPageResponseType | string>
) => {
  let room = await RoomModel.findOne({ name: req.body.roomName });
  lock.acquire(room._id, async () => {
    room = await RoomModel.findOne({ name: req.body.roomName });

    if (req.body.spectating) {
      if (room.spectatingUsers.find((user) => user === req.user._id)) {
        console.log("Spectating room that you are already spectating?");
      } else {
        room.spectatingUsers = room.spectatingUsers.concat(req.user._id);
      }
    } else {
      if (room.users.find((user) => user === req.user._id)) {
        console.log("Joining room that you are already in?");
      } else {
        room.users = room.users.concat(req.user._id);
      }
    }

    socketManager.getSocketFromUserID(req.user._id).join(room._id);
    const gameId = room.gameId.slice(-1)[0];
    const game: Game | undefined = gameId && (await GameModel.findById(gameId));
    const level = await LevelModel.findById(room.levelId);
    const status = !game ? "waiting" : game.status;
    const yourScore = game?.scores?.find((score) => score.userId === req.user._id).score;
    const questionId =
      status === "inProgress" &&
      yourScore &&
      yourScore < game.questions.length &&
      game.questions[yourScore];
    const question = questionId && (await QuestionModel.findById(questionId));
    const data: joinRoomPageSocketEmitType = { roomName: room.name, userId: req.user._id };
    const roomUsers = (await UserModel.find({ _id: { $in: room.users } })).map((user) =>
      _.pick(user, ["name", "rating", "_id"])
    );

    socketManager.getIo().in(room._id).emit("joinRoomPage", data);
    await room.save();
    res.status(200).json({
      status,
      roomId: room._id,
      levelName: level.title,
      users: roomUsers,
      spectatingUsers: room.spectatingUsers,
      spectating: req.body.spectating || (status === "inProgress" && !question),
      question: _.unset(question, "answer"),
      startTime: game && !(game.status === "complete") && game.startTime,
      scores: game?.scores,
    });
  });
};

const startGame = (
  req: TypedRequestBody<startGameRequestBodyType>,
  res: TypedResponse<startGameResponseType>
) => {};

const guess = (
  req: TypedRequestBody<guessRequestBodyType>,
  res: TypedResponse<guessResponseType>
) => {};

const message = async (
  req: TypedRequestBody<messageRequestBodyType>,
  res: TypedResponse<messageResponseType>
) => {
  const user = await UserModel.findById(req.user._id);
  const newMessage = new MessageModel({
    roomId: req.body.roomId,
    text: req.body.text,
    kind: req.body.kind,
    userId: req.user._id,
    userName: user.name,
  });
  const newMessageSaved = await newMessage.save();
  const data: messageSocketEmitType = { roomId: req.body.roomId, message: newMessageSaved };
  socketManager.getIo().in(req.body.roomId).emit("message", data);
  res.status(200).json({ error: false });
};

export default {
  joinRoomPage,
  startGame,
  guess,
  message,
};
