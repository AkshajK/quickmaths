import Express from "express";
import { Query, Send } from "express-serve-static-core";
import { Server } from "socket.io";

var AsyncLock = require("async-lock");

import { User } from "../server/models/user";
import { Room } from "../server/models/room";
import { Game, Score } from "../server/models/game";
import { Message } from "../server/models/message";
import { Question } from "../server/models/question";
import LevelModel, { Level } from "../server/models/level";
import { QuestionType } from "../server/models/questiontype";

export { User, Room, Game, Score, Message, Question, Level, QuestionType };

export const lock = new AsyncLock();

const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
export function generateString(length: number) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const getLobbyRoom = async (room: Room, levelName?: string): Promise<LobbyRoom> => {
  const levelNameDB: string =
    levelName || ((await LevelModel.findById(room.levelId)) as Level).title;
  return {
    inProgress: room.inProgress,
    host: room.host,
    players: room.users.length,
    levelName: levelNameDB,
    lastActive: room.lastActive,
    name: room.name,
  };
};

export const removeUserFromRoom = async (room: Room, userId: string, io: Server) => {
  room.spectatingUsers = room.spectatingUsers.filter((userid) => userid !== userId + "");
  room.users = room.users.filter((userid) => userid !== userId + "");
  const data: leaveRoomPageSocketEmitType = {
    roomName: room.name,
    userId: userId + "",
  };
  const updatedRoom = await getLobbyRoom(room);
  io.in("" + room._id).emit("leaveRoomPage", data);
  io.in("Lobby").emit("updateRoom", updatedRoom);
  await room.save();
};

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
  user?: User;
}
export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
  user?: User;
}
export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}

export type Leaderboard = {
  topRatings: { userId: string; userName: string; rating: number }[]; // top 100 ratings
  topScores: { userId: string; userName: string; score: number }[]; // top 100 scores
};

export type joinLobbyPageRequestBodyType = { levelId?: string };

export type LobbyRoom = {
  inProgress: boolean;
  host: string;
  players: number;
  levelName: string;
  lastActive: Date;
  name: string;
};

export type RoomUser = { name: string; rating: number; _id: string };

export type LobbyLevel = { _id: string; title: string };

export type joinLobbyPageResponseType = {
  leaderboard: Leaderboard;
  levels: LobbyLevel[];
  levelId: string;
  rooms: LobbyRoom[]; // only waiting and inProgress rooms
  userInfo: {
    _id: string;
    name: string;
    rating: number;
    highScore: number;
  };
};

export type createRoomRequestBodyType = { private: boolean; levelId: string };

export type createRoomResponseType = { room: Room };

export type createRoomSocketEmitType = { room: Room };

export type joinRoomPageRequestBodyType = { roomName: string; spectating?: boolean };

export type joinRoomPageResponseType = {
  status: "waiting" | "aboutToStart" | "inProgress" | "complete";
  levelName: string;
  users: RoomUser[];
  spectatingUsers: RoomUser[];
  spectating: boolean;
  roomId: string;
  // in Progress
  question?: Question;
  // in Progress or about to start
  startTime?: Date;
  // in Progress or compolete or about to start
  scores?: Score[];
};

export type joinRoomPageSocketEmitType = {
  roomName: string;
  user: RoomUser;
  spectating?: boolean;
};

export type leaveRoomPageSocketEmitType = {
  roomName: string;
  userId: string;
};

export type startGameRequestBodyType = { roomId: string };

export type startGameResponseType = { error: boolean };

export type startGameSocketEmitType = { startTime: Date; scores: Score[] };

export type guessRequestBodyType = { roomId: string; answer: string };

export type guessResponseType = { correct: boolean; question?: Question };

export type guessSocketEmitType = { roomId: string; scores: Score[] };

export type messageRequestBodyType = { roomId: string; text: string; kind: "text" };

export type messageResponseType = { error: boolean };

export type messageSocketEmitType = { roomId: string; message: Message };

export type newLevelRequestBodyType = { title: string };

export type newLevelResponseType = { level: Level };

export type saveLevelRequestBodyType = { newLevel: Level };

export type saveLevelResponseType = { error: boolean };

export type tryCodeRequestBodyType = {};

export type tryCodeResponseType = {};

export type newQuestionTypeRequestBodyType = {};

export type newQuestionTypeResponseType = {};

export type saveQuestionTypeRequestBodyType = {};

export type saveQuestionTypeResponseType = {};
