import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  question: String,
  answer: String,
  askedAt: { type: Date, default: Date.now },
});

const actionItemSchema = new mongoose.Schema({
  task: String,
  responsiblePerson: String,
  dueDate: Date,
});

const decisionSchema = new mongoose.Schema({
  decision: String,
});

const audioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  fileUrl: String,
  transcript: String,
  summary: {
    paragraph: String,
    keyDecisions: [decisionSchema],
    actionItems: [actionItemSchema],
  },
  queries: [querySchema],
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Audio", audioSchema);
