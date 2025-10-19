import axios from "axios";
import fs from "fs";

const ASSEMBLYAI_URL = "https://api.assemblyai.com/v2";

export const uploadToAssemblyAI = async (filePath, apiKey) => {
  const res = await axios.post(
    `${ASSEMBLYAI_URL}/upload`,
    fs.createReadStream(filePath),
    { headers: { authorization: apiKey } }
  );
  return res.data.upload_url;
};

export const transcribeAudio = async (uploadUrl, apiKey) => {
  const res = await axios.post(
    `${ASSEMBLYAI_URL}/transcript`,
    { audio_url: uploadUrl },
    { headers: { authorization: apiKey } }
  );
  return res.data.id;
};

export const pollTranscription = async (transcriptId, apiKey) => {
  while (true) {
    const res = await axios.get(`${ASSEMBLYAI_URL}/transcript/${transcriptId}`, {
      headers: { authorization: apiKey },
    });
    if (res.data.status === "completed") return res.data.text;
    if (res.data.status === "failed") throw new Error("Transcription failed");
    await new Promise((r) => setTimeout(r, 5000));
  }
};
