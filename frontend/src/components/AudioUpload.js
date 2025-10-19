export default function AudioUpload() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Upload Audio</h2>
      <input type="file" accept="audio/*" className="w-full border p-2 rounded" />
      <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Transcribe & Summarize
      </button>
    </div>
  );
}
