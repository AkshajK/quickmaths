const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  rating: Number,
  highScore: Number,
  isAdmin: Boolean,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
