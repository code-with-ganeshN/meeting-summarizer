# Meeting Summarizer

This Node.js backend service allows users to upload audio files, transcribe them using [AssemblyAI](https://www.assemblyai.com/), and summarize the transcript using [Gemini 2.5 Flash](https://ai.google.dev/). The final transcript and summary are stored in MongoDB.

## Demo Video
https://github.com/user-attachments/assets/50845a01-1938-45d8-897e-4fff7868cf1c

## Features

- Upload `.mp3`, `.wav`, or other audio formats
- Transcribe audio to text using AssemblyAI
- Summarize long transcripts using Gemini 2.5 Flash (Google Generative Language API)
- Chunked summarization for large transcripts
- Stores transcript and summary in MongoDB
- Deletes uploaded audio file after processing

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Axios for HTTP requests
- AssemblyAI for transcription
- Gemini 2.5 Flash for summarization
- Multer for file uploads

## File Structure

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



## Setup Instructions

1. Clone the repo**

   ```bash
   git clone https://github.com/your-username/meeting-summarizer.git
   cd meeting-summarizer


## Install dependencies
    npm install


## .env contents
    ASSEMBLYAI_API_KEY=your_assemblyai_api_key
    GEMINI_API_KEY=your_gemini_api_key
    MONGODB_URI=your_mongodb_connection_string


## Start backend server(Node)
    node server.js


## Start frontend server(React)
    npm start




## API Endpoint


      
      POST   /api/audio/upload
  
  Upload an audio file for transcription and summarization.

      Headers: Content-Type: multipart/form-data
  
  Body: audio field containing the file

  Response
              
              {
                  "transcript": "Full transcript text...",
                  "summary": "Concise bullet-point summary..."
              }



## How It Works

  Audio file is uploaded via Multer

  File is streamed to AssemblyAI for transcription

  Transcript is chunked into 4000-character blocks

  Each chunk is summarized using Gemini 2.5 Flash

  Final summary and transcript are saved to MongoDB

  Audio file is deleted from disk




## How to Get API Keys
  
  
	 AssemblyAI API Key
      
  ## AssemblyAI provides speech-to-text transcription services.
      
  Go to https://www.assemblyai.com

  Click Sign Up or Log In using your email or GitHub account.

  Once logged in, navigate to your Dashboard.

  Copy your API Key from the top-right corner or under the API Keys section.

  Paste it into your .env file:
  
    ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
    

  ## Gemini (Google Generative Language API) Key
   
   Gemini 2.5 Flash is part of Google's Generative Language API.

   Visit https://makersuite.google.com

   Sign in with your Google account.

   Click Get API Key from the top navigation or go to Google AI Studio.

   Copy the generated API key.

   Paste it into your .env file:

    GEMINI_API_KEY=your_gemini_api_key_here

    
⚠️ Keep your API keys secret. Never commit them to GitHub or share them publicly.




