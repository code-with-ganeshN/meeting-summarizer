// import axios from "axios";
// import Audio from "../models/AudioModel.js";

// export const askQuery = async (req, res) => {
//   try {
//     const { audioId, query } = req.body;

//     // 1️⃣ Fetch transcript from DB
//     const audioDoc = await Audio.findById(audioId);
//     if (!audioDoc) {
//       return res.status(404).json({ error: "Audio record not found" });
//     }

//     const transcript = audioDoc.transcript;

//     // 2️⃣ Ask Gemini using transcript as context
//     const geminiRes = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [
//               {
//                 text: `You are a helpful assistant answering questions based only on the following meeting transcript.

// Transcript:
// ${transcript}

// Question:
// ${query}

// Answer in a clear, concise way referring to the meeting content only.`
//               }
//             ]
//           }
//         ]
//       }
//     );

//     const answer =
//       geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No answer found.";

//     res.json({ response: answer });
//   } catch (error) {
//     console.error("Error in askQuery:", error);
//     res.status(500).json({
//       error: "Error processing query",
//       details: error.response?.data || error.message,
//     });
//   }
// };
