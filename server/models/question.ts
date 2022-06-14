import { Schema, model, Document } from "mongoose";

const QuestionSchema = new Schema({
  number: Number,
  prompt: String,
  answer: String,
  questionTypeId: String,
});

export interface Question extends Document {
  number: number;
  prompt: string;
  answer?: string;
  questionTypeId: string;
  _id: string;
}

const QuestionModel = model<Question>("Question", QuestionSchema);

export default QuestionModel;
