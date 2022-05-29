const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  gameId: String,
  prompt: String,
  answer: Number,
  questionTypeId: String,
});

// compile model from schema
module.exports = mongoose.model("question", QuestionSchema);
