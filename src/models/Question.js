const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
  questionText: String,
  options: [String],
  correctAnswerIndex: Number,
  category: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
},{timestamps : true});

module.exports = mongoose.model("Question", questionSchema);
