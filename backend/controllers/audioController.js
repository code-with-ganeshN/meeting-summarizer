import fs from "fs";
import Audio from "../models/AudioModel.js";
import {
  uploadToAssemblyAI,
  transcribeAudio,
  pollTranscription,
} from "../services/assemblyService.js";
import {
  generateSummaryChunk,
  generateFinalSummary,
} from "../services/geminiService.js";
import { parseSummaryResponse } from "../utils/summaryParse.js";

const chunkText = (text, size = 4000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks;
};

export const processAudio = async (req, res) => {
  try {
    const filePath = req.file.path;

    const uploadUrl = await uploadToAssemblyAI(filePath, process.env.ASSEMBLYAI_API_KEY);
    const transcriptId = await transcribeAudio(uploadUrl, process.env.ASSEMBLYAI_API_KEY);
    const transcriptText = await pollTranscription(transcriptId, process.env.ASSEMBLYAI_API_KEY);

    const chunks = chunkText(transcriptText);
    const partialSummaries = [];
    for (const chunk of chunks) {
      const text = await generateSummaryChunk(chunk, process.env.GEMINI_API_KEY);
      partialSummaries.push(text);
    }

    const mergedText = partialSummaries.join("\n");
    const structuredText = await generateFinalSummary(mergedText, process.env.GEMINI_API_KEY);
    const parsedSummary = parseSummaryResponse(structuredText);

    const audioDoc = new Audio({
      filename: req.file.originalname,
      transcript: transcriptText,
      summary: parsedSummary,
    });
    await audioDoc.save();

    fs.unlinkSync(filePath);

    res.json({ transcript: transcriptText, summary: parsedSummary });
  } catch (err) {
    console.error("Error in processAudio:", err);
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
};
