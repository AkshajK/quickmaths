const mongoose = require("mongoose");

const LevelSchema = new mongoose.Schema({
  title: String,
  distribution: [{ questionTypeId: String, percentage: Number }],
  author: String, // userId
});

// compile model from schema
module.exports = mongoose.model("level", LevelSchema);
