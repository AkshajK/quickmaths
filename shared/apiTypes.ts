import Express from "express";
import { Query, Send } from "express-serve-static-core";
import Room from "./Room";
import Game from "./Game";
import Score from "./Score";
import Message from "./Message";
import Question from "./Question";
import Level from "./Level";
var AsyncLock = require("async-lock");

export const lock = new AsyncLock();

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
  users: { name: string; rating: string; _id: string }[];
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