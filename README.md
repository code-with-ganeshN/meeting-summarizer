# Meeting Summarizer

This Node.js backend service allows users to upload audio files, transcribe them using [AssemblyAI](https://www.assemblyai.com/), and summarize the transcript using [Gemini 2.5 Flash](https://ai.google.dev/). The final transcript and summary are stored in MongoDB.

## 🚀 Features

- Upload `.mp3`, `.wav`, or other audio formats
- Transcribe audio to text using AssemblyAI
- Summarize long transcripts using Gemini 2.5 Flash (Google Generative Language API)
- Chunked summarization for large transcripts
- Stores transcript and summary in MongoDB
- Deletes uploaded audio file after processing

## 📦 Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Axios for HTTP requests
- AssemblyAI for transcription
- Gemini 2.5 Flash for summarization
- Multer for file uploads

## 📁 File Structure

audioSummarizer/
│
├─ backend/                      # Node.js backend
│   ├─ controllers/              # Handles API logic
│   │   └─ audioController.js
│   ├─ models/                   # MongoDB schema/models
│   │   └─ Audio.js
│   ├─ routes/                   # API routes
│   │   └─ audioRoutes.js
│   ├─ uploads/                  # Uploaded audio files
│   ├─ node_modules/             
│   ├─ .env                      # Environment variables (API keys, DB URI)
│   ├─ .gitignore
│   ├─ package.json
│   ├─ package-lock.json
│   └─ server.js                 # Entry point of backend server
│
├─ frontend/                     # React frontend
│   ├─ src/                      # React source files
│   │   ├─ App.js                # Main React app
│   │   ├─ App.css
│   │   ├─ index.js
│   │   ├─ index.css
│   │   └─ reportWebVitals.js
│   ├─ public/                   # Public assets
│   │   └─ index.html
│   ├─ node_modules/
│   ├─ .gitignore
│   ├─ package.json
│   ├─ package-lock.json
│   └─ README.md
│
└─ README.md                     # Project overview and instructions




