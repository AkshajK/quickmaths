const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  roomId: String,
  text: String,
  kind: "text",
  userId: String,
  userName: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
