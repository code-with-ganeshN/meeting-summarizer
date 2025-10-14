import mongoose from "mongoose";

const audioSchema = new mongoose.Schema({
  filename: String,
  transcript: String,
  summary: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Audio", audioSchema);
