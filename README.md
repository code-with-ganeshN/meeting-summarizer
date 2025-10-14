# 🎙️ Audio Transcription & Summarization API

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

