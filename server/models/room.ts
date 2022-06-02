import { Schema, model, Document } from "mongoose";

const RoomSchema = new Schema({
  name: String,
  isPrivate: Boolean,
  inProgress: Boolean,
  levelId: String,
  users: [String], // userIds
  spectatingUsers: [String], // userIds,
  gameId: [String],
  host: String,
  lastActive: Date,
});

export interface Room extends Document {
  name: string;
  isPrivate: boolean;
  inProgress: boolean;
  levelId: string;
  users: string[]; // userIds
  spectatingUsers: string[]; // userIds,
  gameId: string[];
  _id: string;
  host: string;
  lastActive: Date;
}

const RoomModel = model<Room>("Room", RoomSchema);

export default RoomModel;
