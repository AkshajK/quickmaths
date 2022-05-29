const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  status: "waiting" | "inProgress" | "complete",
  host: String,
  questions: [String], // questionIds
  scores: [{ userId: String, name: String, questionNumber: Number, score: Number }], // when game starts, initialize scores with all the participants,
  startTime: Date,
  timeLimit: Number,
});

// compile model from schema
module.exports = mongoose.model("game", GameSchema);
