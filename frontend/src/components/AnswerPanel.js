export default function AnswerPanel() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Answers</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        <li>✅ Decision: Use manual labor instead of machines</li>
        <li>✅ Action: Henry Jones to follow up with GP</li>
        <li>✅ Insight: No health & safety policy was in place</li>
      </ul>
    </div>
  );
}
