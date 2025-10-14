import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("audio", file);

    const res = await axios.post("http://localhost:5000/api/audio/upload", formData);
    setTranscript(res.data.transcript);
    setSummary(res.data.summary);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">🎧 Audio Translator & Summarizer</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      {transcript && (
        <div>
          <h2>🗣️ Transcript:</h2>
          <p>{transcript}</p>

          <h2>🧠 Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
//frontend code 