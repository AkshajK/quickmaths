import { Schema, model, Document } from "mongoose";

const QuestionSchema = new Schema({
  gameId: String,
  prompt: String,
  answer: Number,
  questionTypeId: String,
});

export interface Question extends Document {
  gameId: string;
  prompt: string;
  answer?: number;
  questionTypeId: string;
  _id: string;
}

const QuestionModel = model<Question>("Question", QuestionSchema);

export default QuestionModel;
