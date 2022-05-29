const mongoose = require("mongoose");

const QuestionTypeSchema = new mongoose.Schema({
  pythonScript: String,
  title: String,
  author: String, // userId
});

// compile model from schema
module.exports = mongoose.model("questiontype", QuestionTypeSchema);
