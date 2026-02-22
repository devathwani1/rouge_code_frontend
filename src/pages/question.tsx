import React from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { useGetQuestionSolveDataQuery } from "../store/api/challengesApi";
import logo from "../assets/logo.svg";

const Question: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { data: response, isLoading, error } = useGetQuestionSolveDataQuery(questionId!);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0f0f0f] text-white flex items-center justify-center font-bold tracking-[0.3em] uppercase opacity-50 animate-pulse">
        Initializing Workspace...
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="h-screen bg-[#0f0f0f] text-red-500 flex items-center justify-center font-bold tracking-[0.2em] uppercase">
        Failed to Load Challenge Environment
      </div>
    );
  }

  const questionData = response.data;

  return (
    <div className="h-screen bg-[#0f0f0f] text-gray-200 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="p-3 px-6 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src={logo} alt="RogueCode" className="w-10 brightness-110 drop-shadow-glow" />
          <nav className="flex gap-6 text-sm font-medium text-gray-400">
            <span className="hover:text-white cursor-pointer transition-colors">Problems</span>
            <span className="hover:text-white cursor-pointer transition-colors">Contest</span>
            <span className="hover:text-white cursor-pointer transition-colors text-blue-400">Discuss</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 shadow-lg" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Background blobs for depth */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* LEFT PANEL - Description */}
        <div className="w-[45%] p-8 overflow-y-auto scrollbar-hide border-r border-white/5 bg-[#141414]/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              MISSION ID: {questionData.id?.slice(0, 8)}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border font-mono ${questionData.difficulty === 'easy' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                questionData.difficulty === 'medium' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                  'bg-red-400/10 text-red-400 border-red-400/20'
              }`}>
              {questionData.difficulty}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6">
            {questionData.title}
          </h1>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-gray-400 leading-relaxed whitespace-pre-line">
              {questionData.description}
            </p>
          </div>

          {/* Examples section */}
          <div className="mt-12 space-y-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full" />
              Test Scenarios
            </h2>

            {questionData.test_cases.filter(tc => !tc.is_hidden).map((test, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-[#1a1a1a] rounded-xl p-6 border border-white/5 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Input Data</p>
                    <code className="text-blue-400 font-mono text-sm block bg-black/30 p-2 rounded-lg">
                      {questionData.parameters.map((p, i) => `${p.name} = ${JSON.stringify(test.input_data[i])}`).join(', ')}
                    </code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expected Result</p>
                    <code className="text-green-400 font-mono text-sm block bg-black/30 p-2 rounded-lg">
                      {JSON.stringify(test.expected_output)}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {questionData.constraints && (
            <div className="mt-12 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <p className="text-sm text-indigo-300 font-medium">Mission Constraints:</p>
              <div className="mt-2 text-xs text-gray-500 space-y-1 whitespace-pre-line">
                {questionData.constraints}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Editor & Output */}
        <div className="flex-1 flex flex-col z-10">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-6 py-2 bg-[#1a1a1a] border-b border-white/5">
              <div className="flex gap-4">
                <span className="text-xs font-bold text-blue-400 py-2 border-b-2 border-blue-400 uppercase tracking-widest">Python 3</span>
              </div>
            </div>

            <div className="flex-1 bg-[#1e1e1e]">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                defaultValue={questionData.starter_code}
                options={{
                  fontSize: 15,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 20 },
                  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                  lineNumbers: 'on',
                  cursorStyle: 'line',
                  smoothScrolling: true,
                  scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden'
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-[#111] border-t border-white/5 p-4 px-8 flex items-center justify-between shadow-2xl">
            <div className="flex gap-4">
              <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-white/5">
                Terminal
              </button>
            </div>
            <div className="flex gap-3">
              <button className="bg-white/5 border border-white/10 text-gray-300 px-6 py-2 rounded-xl font-bold text-sm hover:bg-white/10 transition shadow-lg active:scale-95">
                Run Simulation
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition active:scale-95">
                Upload Logic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;