import { Schema, model, Document } from "mongoose";

const GameSchema = new Schema({
  status: String,
  host: String,
  questions: [String], // questionIds
  scores: [{ userId: String, name: String, questionNumber: Number, score: Number }], // when game starts, initialize scores with all the participants,
  startTime: Date,
  timeLimit: Number,
});

export type Score = { userId: string; name: string; questionNumber: number; score: number };

export interface Game extends Document {
  status: "aboutToStart" | "inProgress" | "complete";
  host: string;
  questions: string[]; // questionIds
  scores: Score[]; // when game starts, initialize scores with all the participants,
  startTime: Date;
  timeLimit: number;
  _id: string;
}

const GameModel = model<Game>("Game", GameSchema);

export default GameModel;
