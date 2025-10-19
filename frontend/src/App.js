import AudioUpload from "./components/AudioUpload";
import SummaryDisplay from "./components/SummaryDisplay";
import AskQuery from "./components/AskQuery";
import AnswerPanel from "./components/AnswerPanel";

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
      {/* Left Panel */}
      <div className="md:w-1/2 p-6 space-y-6 border-r border-gray-200 overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-600">🎙️ Meeting Summarizer</h1>
        <AudioUpload />
        <SummaryDisplay />
        <AskQuery />
      </div>

      {/* Right Panel */}
      <div className="md:w-1/2 p-6 overflow-y-auto">
        <AnswerPanel />
      </div>
    </div>
  );
}
