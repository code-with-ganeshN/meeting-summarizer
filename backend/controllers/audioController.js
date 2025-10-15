import axios from "axios";
import Audio from "../models/AudioModel.js";
import fs from "fs";

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

    // 4️⃣ Split transcript into manageable chunks
    const chunks = chunkText(transcriptText, 4000);

    // Step 1: Get partial summaries for each chunk
    let partialSummaries = [];

    for (const chunk of chunks) {
      const summaryRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Summarize this part of a meeting transcript briefly:\n\n${chunk}`
                }
              ]
            }
          ]
        }
      );

      const summaryText =
        summaryRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      partialSummaries.push(summaryText.trim());
    }

    // Step 2: Merge all partial summaries into one text
    const mergedSummaryText = partialSummaries.join("\n");

    // Step 3: Generate final combined meeting summary and action items
    const finalRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an expert meeting summarizer. Based on the following summarized segments, create ONE cohesive final summary covering the entire meeting. 
Include:
1. A concise meeting summary paragraph.
2. A clear list of key decisions made.
3. A list of actionable items with responsible persons if mentioned.

Meeting Summaries:\n\n${mergedSummaryText}`
              }
            ]
          }
        ]
      }
    );

    const fullSummary =
      finalRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No final summary generated.";

    // 5️⃣ Save to MongoDB
    const audioDoc = new Audio({
      filename: req.file.originalname,
      transcript: transcriptText,
      summary: fullSummary,
    });
    await audioDoc.save();

    // 6️⃣ Delete uploaded audio file
    fs.unlinkSync(filePath);

    res.json({ transcript: transcriptText, summary: fullSummary });
  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).json({
      error: "Error processing audio file",
      details: error.response?.data || error.message,
    });
  }
};
