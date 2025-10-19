import Audio from "../models/AudioModel.js";
import { askGeminiQuestion } from "../services/geminiService.js";

const truncate = (text, max = 4000) =>
  text.length > max ? text.slice(0, max) + "..." : text;

export const askQuery = async (req, res) => {
  try {
    const { audioId, question } = req.body;
    const audioDoc = await Audio.findById(audioId);
    if (!audioDoc) return res.status(404).json({ error: "Meeting not found" });

    const context = `
Meeting Summary:
${truncate(audioDoc.summary.paragraph)}

Key Decisions:
${audioDoc.summary.keyDecisions.map((d) => "- " + d.decision).join("\n")}

Action Items:
${audioDoc.summary.actionItems
  .map((a) => `- ${a.task} (${a.responsiblePerson || "Unassigned"})`)
  .join("\n")}
`;

    const answer = await askGeminiQuestion(context, question, process.env.GEMINI_API_KEY);
    audioDoc.queries.push({ question, answer });
    await audioDoc.save();

    res.json({ question, answer });
  } catch (err) {
    console.error("Error in askQuery:", err);
    res.status(500).json({ error: "Query failed", details: err.message });
  }
};
