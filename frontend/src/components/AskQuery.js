export default function AskQuery() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Ask a Question</h2>
      <input
        type="text"
        placeholder="e.g. What decisions were made?"
        className="w-full border p-2 rounded"
      />
      <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Ask Gemini
      </button>
    </div>
  );
}
