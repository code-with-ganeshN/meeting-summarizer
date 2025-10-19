import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import audioRoutes from "./routes/audioRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"; // ✅ fixed typo

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/audio", audioRoutes);
app.use("/api/chat", chatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
