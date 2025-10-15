import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const res = await axios.post("http://localhost:5000/api/audio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTranscript(res.data.transcript);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      alert("Failed to upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen bg-gray-50 flex flex-col items-center justify-start py-16 px-4">
      <h1 className="bg-white p-1 border rounded text-4xl font-extrabold mb-8 text-center text-green-800">
        Meeting Translator & Summarizer
      </h1>
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload & Process"}
        </button>
      </div>

      {transcript && (
        <div className="w-full max-w-2xl mt-10 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-gray-700">🗣️ Transcript</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{transcript}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-gray-700">🧠 Summary</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
