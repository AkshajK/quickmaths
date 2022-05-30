import { Schema, model, Document } from "mongoose";

const UserSchema = new Schema({
  name: String,
  googleid: String,
  rating: Number,
  highScore: Number,
  isAdmin: Boolean,
});

export interface User extends Document {
  name: string;
  googleid: string;
  rating: number;
  highScore: number;
  isAdmin: boolean;
  _id: string;
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
