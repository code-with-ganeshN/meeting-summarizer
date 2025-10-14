import axios from "axios";
import Audio from "../models/AudioModel.js";
import fs from "fs";

// Helper function to split text into chunks
const chunkText = (text, chunkSize = 4000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

export const processAudio = async (req, res) => {
  try {
    const filePath = req.file.path;

    // 1️⃣ Upload to AssemblyAI
    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      fs.createReadStream(filePath),
      { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
    );

    // 2️⃣ Request transcription
    const transcriptResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: uploadResponse.data.upload_url },
      { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
    );

    const transcriptId = transcriptResponse.data.id;
    let transcriptText = "";

    // 3️⃣ Poll until transcription is ready
    while (true) {
      const statusRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
      );
      if (statusRes.data.status === "completed") {
        transcriptText = statusRes.data.text;
        break;
      } else if (statusRes.data.status === "failed") {
        throw new Error("Transcription failed");
      }
      await new Promise((r) => setTimeout(r, 5000));
    }

    // 4️⃣ Summarize in chunks using Gemini 2.5 Flash
    const chunks = chunkText(transcriptText, 4000);
    let combinedSummary = "";

    for (const chunk of chunks) {
      const summaryRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Summarize the following meeting text in concise points:\n\n${chunk}`
                }
              ]
            }
          ]
        }
      );

      const summaryText =
        summaryRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      combinedSummary += summaryText
        ? summaryText + "\n"
        : "[No summary returned]\n";
    }

    const summary = combinedSummary.trim() || "No summary.";

    // 5️⃣ Save to MongoDB
    const audioDoc = new Audio({
      filename: req.file.originalname,
      transcript: transcriptText,
      summary,
    });
    await audioDoc.save();

    // 6️⃣ Delete uploaded audio file
    fs.unlinkSync(filePath);

    res.json({ transcript: transcriptText, summary });
  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).json({
      error: "Error processing audio file",
      details: error.response?.data || error.message,
    });
  }
};
