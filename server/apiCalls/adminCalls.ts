import User from "../../shared/user";
import Game from "../../shared/game";
import Level from "../../shared/level";
import Message from "../../shared/message";
import Question from "../../shared/question";
import QuestionType from "../../shared/questiontype";
import Room from "../../shared/room";
import {
  TypedRequestBody,
  TypedResponse,
  newLevelRequestBodyType,
  newLevelResponseType,
  saveLevelRequestBodyType,
  saveLevelResponseType,
  tryCodeRequestBodyType,
  tryCodeResponseType,
  newQuestionTypeRequestBodyType,
  newQuestionTypeResponseType,
  saveQuestionTypeRequestBodyType,
  saveQuestionTypeResponseType,
} from "../../shared/apiTypes";

const newLevel = (
  req: TypedRequestBody<newLevelRequestBodyType>,
  res: TypedResponse<newLevelResponseType>
) => {};

const saveLevel = (
  req: TypedRequestBody<saveLevelRequestBodyType>,
  res: TypedResponse<saveLevelResponseType>
) => {};

const tryCode = (
  req: TypedRequestBody<tryCodeRequestBodyType>,
  res: TypedResponse<tryCodeResponseType>
) => {};

const newQuestionType = (
  req: TypedRequestBody<newQuestionTypeRequestBodyType>,
  res: TypedResponse<newQuestionTypeResponseType>
) => {};

const saveQuestionType = (
  req: TypedRequestBody<saveQuestionTypeRequestBodyType>,
  res: TypedResponse<saveQuestionTypeResponseType>
) => {};

export default {
  newLevel,
  saveLevel,
  tryCode,
  newQuestionType,
  saveQuestionType,
};
