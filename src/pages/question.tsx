import React from "react";
import Editor from "@monaco-editor/react";
import logo from "../assets/logo.svg";
import { useParams } from "react-router-dom";
import { useGetQuestionByDayQuery } from "../store/api/challengesApi";

const Question: React.FC = () => {
  const { difficulty, day } = useParams<{
    difficulty: string;
    day: string;
  }>();

  if (!difficulty || !day) {
    return <div className="text-white p-10">Invalid URL</div>;
  }
  const dayNumber = Number(day);
  const { data, isLoading, isError } =
    useGetQuestionByDayQuery({ difficulty, day:dayNumber });
  if (isLoading)
    return <div className="text-white p-10">Loading...</div>;

  if (isError || !data)
    return <div className="text-red-500 p-10">Error loading question</div>;

  const question = data.data;

  return (
    <div className="h-screen bg-[#1c1c1c] text-white flex flex-col">
      <header className="p-2 bg-[#282828]">
        <img src={logo} alt="RogueCode" className="w-14" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[40%] p-6 border-r border-gray-700 overflow-y-auto">
          <p className="text-sm text-gray-400">
            Day {day}
          </p>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mt-1">
              {question.title}
            </h1>
            <span className="px-3 py-1 rounded-full text-sm text-[#40B7A5] border-[#464646] bg-[#3D3D3D]">
              {question.difficulty}
            </span>
          </div>

          <p className="mt-4 text-gray-300 leading-relaxed">
            {question.description}
          </p>

          {/* Examples */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">
              Examples
            </h2>

            {question.test_cases.map(
              (test: any, index: number) => (
                <div
                  key={index}
                  className="bg-black rounded-md p-4 mb-3"
                >
                  <p className="text-sm text-gray-400">
                    Input:
                  </p>
                  <p className="font-mono">
                    {JSON.stringify(test.input)}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    Output:
                  </p>
                  <p className="font-mono">
                    {JSON.stringify(test.output)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              defaultValue={`# Write your solution here\n\n`}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>

          <div className="flex h-[50px] border-t border-gray-700 bg-[#111] p-2">
            <button className="bg-gray-800 text-[#3A8FFF] px-4 py-1 rounded-xl hover:bg-[#333] transition">
              Submit
            </button>
          </div>

          <div className="h-[220px] border-t border-gray-700 bg-[#111] p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-3">
              Test Cases
            </h2>

            {question.test_cases.map(
              (_: any, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 m-2 rounded-full text-sm text-[#40B7A5] bg-[#3D3D3D]"
                >
                  Case {index + 1}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Question;