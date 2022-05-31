import Express from "express";
import { Query, Send } from "express-serve-static-core";
import Room from "./Room";
import Game from "./Game";
import Question from "./Question";

export interface TypedRequestBody<T> extends Express.Request {
  body: T;
}
export interface TypedRequestQuery<T extends Query> extends Express.Request {
  query: T;
}
export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}

export type joinLobbyPageRequestBodyType = { levelId: string };

export type joinLobbyPageResponseType = {
  leaderboard: {
    topRatings: [{ userId: string; userName: string; rating: number }]; // top 100 ratings
    topScores: [{ userId: string; userName: string; score: number }]; // top 100 scores
  };
  levels: [{ levelId: string; name: string }];
  rooms: [
    {
      gameStatus: "waiting" | "inProgress" | "complete";
      host: string;
      players: number;
      levelName: string;
      lastActive: Date;
    }
  ]; // only waiting and inProgress rooms
  userInfo: {
    userId: string;
    name: string;
    rating: number;
    highScore: number;
  };
};

export type createRoomRequestBodyType = { private: boolean; levelId: string };

export type createRoomResponseType = { room: Room };

export type createRoomSocketEmitType = { room: Room };

export type joinRoomPageRequestBodyType = { roomId: string };

export type joinRoomPageResponseType = { room: Room; game: Game; question: Question };

export type joinRoomPageSocketEmitType = { roomId: string; userId: string };

export type startGameRequestBodyType = { roomId: string };

export type startGameResponseType = { error: boolean };

export type startGameSocketEmitType = {};

export type guessRequestBodyType = {};

export type guessResponseType = {};

export type guessSocketEmitType = {};

export type messageRequestBodyType = {};

export type messageResponseType = {};

export type messageSocketEmitType = {};

export type newDistributionRequestBodyType = {};

export type newDistributionResponseType = {};

export type saveDistributionRequestBodyType = {};

export type saveDistributionResponseType = {};

export type tryCodeRequestBodyType = {};

export type tryCodeResponseType = {};

export type newQuestionTypeRequestBodyType = {};

export type newQuestionTypeResponseType = {};

export type saveQuestionTypeRequestBodyType = {};

export type saveQuestionTypeResponseType = {};
