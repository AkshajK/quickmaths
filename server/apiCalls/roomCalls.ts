import User from "../models/user";
import Game from "../models/game";
import Level from "../models/level";
import Message from "../models/message";
import Question from "../models/question";
import QuestionType from "../models/questiontype";
import Room from "../models/room";
import {
  TypedRequestBody,
  TypedResponse,
  guessRequestBodyType,
  guessResponseType,
  joinRoomPageRequestBodyType,
  joinRoomPageResponseType,
  messageRequestBodyType,
  messageResponseType,
  startGameRequestBodyType,
  startGameResponseType,
} from "../../shared/apiTypes";

const joinRoomPage = (
  req: TypedRequestBody<joinRoomPageRequestBodyType>,
  res: TypedResponse<joinRoomPageResponseType>
) => {};

const startGame = (
  req: TypedRequestBody<startGameRequestBodyType>,
  res: TypedResponse<startGameResponseType>
) => {};

const guess = (
  req: TypedRequestBody<guessRequestBodyType>,
  res: TypedResponse<guessResponseType>
) => {};

const message = (
  req: TypedRequestBody<messageRequestBodyType>,
  res: TypedResponse<messageResponseType>
) => {};
