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
  newDistributionRequestBodyType,
  newDistributionResponseType,
  saveDistributionRequestBodyType,
  saveDistributionResponseType,
  tryCodeRequestBodyType,
  tryCodeResponseType,
  newQuestionTypeRequestBodyType,
  newQuestionTypeResponseType,
  saveQuestionTypeRequestBodyType,
  saveQuestionTypeResponseType,
} from "../../shared/apiTypes";

const newDistribution = (
  req: TypedRequestBody<newDistributionRequestBodyType>,
  res: TypedResponse<newDistributionResponseType>
) => {};

const saveDistribution = (
  req: TypedRequestBody<saveDistributionRequestBodyType>,
  res: TypedResponse<saveDistributionResponseType>
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
