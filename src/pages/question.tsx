import React from "react";
import Editor from "@monaco-editor/react";
import logo from "../assets/logo.svg";

const Question: React.FC = () => {
  return (
    <div className="h-screen bg-[#1c1c1c] text-white flex flex-col">
      <header className="p-2 bg-[#282828]">
        <img src={logo} alt="RogueCode" className="w-14" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[40%] p-6 border-r border-gray-700">
          <p className="text-sm text-gray-400">Day 1</p>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mt-1">Two Sum</h1>
            <span className="px-3 py-1 rounded-full text-sm text-[#40B7A5] border-[#464646] bg-[#3D3D3D] ">
              Easy
            </span>
          </div>

          <p className="mt-4 text-gray-300 leading-relaxed">
            Given an array of integers <b>nums</b> and an integer <b>target</b>,
            return indices of the two numbers such that they add up to target.
            <br /><br />
            You may assume that each input would have exactly one solution,
            and you may not use the same element twice.
            <br /><br />
            You can return the answer in any order.
          </p>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Examples</h2>

            <div className="bg-black rounded-md p-4 mb-3">
              <p className="text-sm text-gray-400">Input:</p>
              <p className="font-mono">nums = [2,7,11,15], target = 9</p>
              <p className="text-sm text-gray-400 mt-2">Output:</p>
              <p className="font-mono">[0,1]</p>
            </div>

            <div className="bg-black rounded-md p-4">
              <p className="text-sm text-gray-400">Input:</p>
              <p className="font-mono">nums = [3,2,4], target = 6</p>
              <p className="text-sm text-gray-400 mt-2">Output:</p>
              <p className="font-mono">[1,2]</p>
            </div>
          </div>
        </div>

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
          <div className="flex h-[50px] border-t border-gray-700 bg-[#111] p-2 text-center justofy-center">
            <button className="flex items-center gap-3 bg-gray-800 text-[#3A8FFF] px-3 py-1 rounded-xl hover:bg-[#333] transition">
              <span className="w-0 h-0 
                border-t-[8px] border-t-transparent
                border-b-[8px] border-b-transparent
                border-l-[12px] border-l-[#4da3ff]">
              </span>
               Submit</button>  
          </div>
          <div className="h-[220px] border-t border-gray-700 bg-[#111] p-4 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-3">Test Cases</h2>  
            <span className="px-3 py-1 m-4 rounded-full text-sm text-[#40B7A5] border-[#464646] bg-[#3D3D3D] ">
              Case 1
            </span>
            <span className="px-3 py-1 m-4 rounded-full text-sm text-[#40B7A5] border-[#464646] bg-[#3D3D3D] ">
              Case 2
            </span>
            <span className="px-3 py-1 m-4 rounded-full text-sm text-[#C80505] border-[#464646] bg-[#3D3D3D] ">
              Case 3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
