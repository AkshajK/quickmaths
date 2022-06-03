import {
  User,
  Game,
  Level,
  Message,
  Question,
  QuestionType,
  Room,
  Score,
} from "../../shared/apiTypes";

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
