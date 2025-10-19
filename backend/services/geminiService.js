import axios from "axios";
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const generateSummaryChunk = async (text, apiKey) => {
  const res = await axios.post(
    `${GEMINI_URL}?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: `Summarize this part of a meeting:\n\n${text}` }] }],
    }
  );
  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

export const generateFinalSummary = async (mergedText, apiKey) => {
  const prompt = `
You are an expert meeting summarizer. Based on the following text, create a structured output in this format:

Summary:
<concise summary paragraph>

Decisions:
- <decision 1>
- <decision 2>

Action Items:
- <task> - <responsible person>

Text:\n\n${mergedText}`;

  const res = await axios.post(
    `${GEMINI_URL}?key=${apiKey}`,
    { contents: [{ parts: [{ text: prompt }] }] }
  );

  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

export const askGeminiQuestion = async (context, question, apiKey) => {
  const prompt = `
You are a meeting assistant. Use the context below to answer the user's question concisely.

Context:
${context}

Question: ${question}`;

  const res = await axios.post(
    `${GEMINI_URL}?key=${apiKey}`,
    { contents: [{ parts: [{ text: prompt }] }] }
  );

  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";
};
