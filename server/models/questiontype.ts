import { Schema, model, Document } from "mongoose";

const QuestionTypeSchema = new Schema({
  pythonScript: String,
  title: String,
  author: String, // userId
});

export interface QuestionType extends Document {
  pythonScript: string;
  title: string;
  author: string; // userId
  _id: string;
}

const QuestionTypeModel = model<QuestionType>("QuestionType", QuestionTypeSchema);

export default QuestionTypeModel;
