const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: String,
  isPrivate: Boolean,
  inProgress: Boolean,
  levelId: String,
  users: [String], // userIds
  spectatingUsers: [String], // userIds,
  gameId: [String],
});

// compile model from schema
module.exports = mongoose.model("room", RoomSchema);
