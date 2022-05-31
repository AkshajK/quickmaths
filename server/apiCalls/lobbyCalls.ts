import User from "../models/user";
import Game from "../models/game";
import Level from "../models/level";
import Message from "../models/message";
import Question from "../models/question";
import QuestionType from "../models/questiontype";
import Room from "../models/room";
import {
  createRoomRequestBodyType,
  createRoomResponseType,
  joinLobbyPageRequestBodyType,
  joinLobbyPageResponseType,
  createRoomSocketEmitType,
  TypedRequestBody,
  TypedResponse,
} from "../../shared/apiTypes";

const joinLobbyPage = (
  req: TypedRequestBody<joinLobbyPageRequestBodyType>,
  res: TypedResponse<joinLobbyPageResponseType>
) => {};

const createRoom = (
  req: TypedRequestBody<createRoomRequestBodyType>,
  res: TypedResponse<createRoomResponseType>
) => {};
