import { Schema, model, Document } from "mongoose";

const MessageSchema = new Schema({
  roomId: String,
  text: String,
  kind: String,
  userId: String,
  userName: String,
});

export interface Message extends Document {
  roomId: string;
  text: string;
  kind: "text";
  userId: string;
  userName: string;
  _id: string;
}

const MessageModel = model<Message>("Message", MessageSchema);

export default MessageModel;
