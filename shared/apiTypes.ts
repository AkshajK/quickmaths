import Express from "express";
import { Query, Send } from "express-serve-static-core";

var AsyncLock = require("async-lock");

import { User } from "../server/models/user";
import { Room } from "../server/models/room";
import { Game, Score } from "../server/models/game";
import { Message } from "../server/models/message";
import { Question } from "../server/models/question";
import { Level } from "../server/models/level";
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

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}
export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}
export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}

export type Leaderboard = {
  topRatings: { userId: string; userName: string; rating: number }[]; // top 100 ratings
  topScores: { userId: string; userName: string; score: number }[]; // top 100 scores
};

export type joinLobbyPageRequestBodyType = { levelId: string };

export type joinLobbyPageResponseType = {
  leaderboard: Leaderboard;
  levels: { _id: string; title: string }[];
  rooms: {
    inProgress: boolean;
    host: string;
    players: number;
    levelName: string;
    lastActive: Date;
    name: string;
  }[]; // only waiting and inProgress rooms
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
  users: { name: string; rating: number; _id: string }[];
  spectatingUsers: string[];
  spectating: boolean;
  roomId: string;
  // in Progress
  question?: Question;
  // in Progress or about to start
  startTime?: Date;
  // in Progress or compolete or about to start
  scores?: Score[];
};

export type joinRoomPageSocketEmitType = { roomName: string; userId: string };

export type startGameRequestBodyType = { roomId: string };

export type startGameResponseType = { error: boolean };

export type startGameSocketEmitType = { startTime: Date; scores: Score[] };

export type guessRequestBodyType = { roomId: string; answer: number };

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
