// models/Match.js
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  result: {
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    player1Score: Number,
    player2Score: Number
  },
  startedAt: Date,
  endedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Match", matchSchema);
