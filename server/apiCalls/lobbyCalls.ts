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
  generateString,
} from "../../shared/apiTypes";

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
  res: TypedResponse<joinLobbyPageResponseType | string>
) => {
  const myUserId: string = req.user?._id as string;
  const levels: Level[] = await LevelModel.find({});
  const condensedLevels = levels.map((level) => ({ _id: level._id, title: level.title }));

  const rooms: Room[] = await RoomModel.find({});
  const condensedRooms = await Promise.all(
    rooms.map(async (room) => {
      const level: Level | null = await LevelModel.findById(room.levelId);
      return {
        inProgress: room.inProgress,
        host: room.host,
        players: room.users.length,
        levelName: level?.title || "No level",
        lastActive: room.lastActive,
        name: room.name,
      };
    })
  );

  const user = (await UserModel.findById(myUserId)) as User;
  const entry: { rating: number; highScore: number; levelId: string } = user.data.find(
    (dataEntry) => dataEntry.levelId === req.body.levelId
  );

  res.status(200).json({
    leaderboard,
    levels: condensedLevels,
    rooms: condensedRooms,
    userInfo: {
      _id: user._id,
      name: user.name,
      rating: entry?.rating || 1200,
      highScore: entry?.highScore || 0,
    },
  });
};

const createRoom = async (
  req: TypedRequestBody<createRoomRequestBodyType>,
  res: TypedResponse<createRoomResponseType>
) => {
  const myUserId: string = req.user?._id as string;
  const room = new RoomModel({
    name: generateString(10),
    isPrivate: req.body.private,
    inProgress: false,
    levelId: req.body.levelId,
    users: [],
    spectatingUsers: [],
    gameId: [],
    host: myUserId,
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
