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
  LobbyRoom,
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
  getLobbyRoom,
} from "../../shared/apiTypes";
import socketManager from "../server-socket";

const leaderboard: Leaderboard = { topRatings: [], topScores: [] };

const joinLobbyPage = async (
  req: TypedRequestBody<joinLobbyPageRequestBodyType>,
  res: TypedResponse<joinLobbyPageResponseType | string>
) => {
  const myUserId: string = req.user?._id as string;
  socketManager.getSocketFromUserID(myUserId)?.join("Lobby") ?? console.log("Error: No socket");
  const levels: Level[] = await LevelModel.find({});
  const condensedLevels = levels.map((level) => ({ _id: level._id, title: level.title }));

  const rooms: Room[] = await RoomModel.find({});
  const condensedRooms: LobbyRoom[] = await Promise.all(rooms.map((room) => getLobbyRoom(room)));

  const user = (await UserModel.findById(myUserId)) as User;
  const entry: { rating: number; highScore: number; levelId: string } | undefined = user.data.find(
    (dataEntry) => (req.body.levelId ? dataEntry.levelId === req.body.levelId : true)
  );
  res.status(200).json({
    leaderboard,
    levels: condensedLevels,
    levelId: entry?.levelId || levels[0]._id,
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
  const savedLobbyRoom = await getLobbyRoom(savedRoom);
  socketManager.getIo().in("Lobby").emit("newRoom", savedLobbyRoom);
  res.status(200).json({ room: savedRoom });
};

export default {
  joinLobbyPage,
  createRoom,
  leaderboard,
};
