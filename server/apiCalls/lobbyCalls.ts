import UserModel from "../models/user";
import GameModel from "../models/game";
import LevelModel from "../models/level";
import MessageModel from "../models/message";
import QuestionModel from "../models/question";
import QuestionTypeModel from "../models/questiontype";
import RoomModel from "../models/room";
import {
  User,
  Game,
  Level,
  Message,
  Question,
  QuestionType,
  Room,
  Score,
} from "../../shared/apiTypes";
var _ = require("lodash");
import cryptoRandomString from "crypto-random-string";

import {
  createRoomRequestBodyType,
  createRoomResponseType,
  joinLobbyPageRequestBodyType,
  joinLobbyPageResponseType,
  createRoomSocketEmitType,
  TypedRequestBody,
  TypedResponse,
  lock,
  Leaderboard,
} from "../../shared/apiTypes";

const leaderboard: Leaderboard = { topRatings: [], topScores: [] };

const joinLobbyPage = async (
  req: TypedRequestBody<joinLobbyPageRequestBodyType>,
  res: TypedResponse<joinLobbyPageResponseType>
) => {
  const levels: Level[] = await LevelModel.find({});
  const condensedLevels = _.pick(levels, ["_id", "title"]);

  const rooms: Room[] = await RoomModel.find({});
  const condensedRooms = await Promise.all(
    rooms.map(async (room) => {
      const level = await LevelModel.findById(room.levelId);
      return {
        inProgress: room.inProgress,
        host: room.host,
        players: room.users.length,
        levelName: level.title,
        lastActive: room.lastActive,
        name: room.name,
      };
    })
  );

  const user = await UserModel.findById(req.user._id);

  res.status(200).json({
    leaderboard,
    levels: condensedLevels,
    rooms: condensedRooms,
    userInfo: _.pick(user, ["_id", "name", "rating", "highScore"]),
  });
};

const createRoom = async (
  req: TypedRequestBody<createRoomRequestBodyType>,
  res: TypedResponse<createRoomResponseType>
) => {
  const room = new RoomModel({
    name: cryptoRandomString({ length: 10, type: "base64" }),
    isPrivate: req.body.private,
    inProgress: false,
    levelId: req.body.levelId,
    users: [],
    spectatingUsers: [],
    gameId: [],
    host: req.user._id,
    lastActive: new Date(),
  });
  const savedRoom = await room.save();
  res.status(200).json({ room: savedRoom });
};

export default {
  joinLobbyPage,
  createRoom,
  leaderboard,
};
