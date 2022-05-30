import { Schema, model, Document } from "mongoose";

const LevelSchema = new Schema({
  title: String,
  distribution: [{ questionTypeId: String, percentage: Number }],
  author: String, // userId
});

export interface Level extends Document {
  title: string;
  distribution: [{ questionTypeId: string; percentage: number }];
  author: string; // userId
  _id: string;
}

const LevelModel = model<Level>("Level", LevelSchema);

export default LevelModel;
