import { Schema, model, Document } from "mongoose";

const UserSchema = new Schema({
  name: String,
  googleid: String,
  data: [
    {
      rating: Number,
      highScore: Number,
      levelId: String,
    },
  ],
});

export interface User extends Document {
  name: string;
  googleid: string;
  data: { rating: number; highScore: number; levelId: string }[];
  isAdmin: boolean;
  _id: string;
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
