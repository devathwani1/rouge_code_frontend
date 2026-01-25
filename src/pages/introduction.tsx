import React from "react";
import logo from "../assets/logo.svg";
import avatar from "../assets/avatar_intro.svg";

const Intro: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col">
      
      <header className="p-6">
        <img src={logo} alt="RogueCode" className="w-14" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={logo} alt="Rogue Code Logo" className="w-[260px] mx-auto" />
        <h1 className="text-4xl font-bold tracking-wide">ROGUECODE</h1>
      </div>

      <div className="mx-auto mb-10 w-[90%] max-w-5xl border-4 border-white flex bg-black ">
      
        <div className="w-1/4 bg-white flex items-end justify-center overflow-hidden">
          <img
            src={avatar}
            alt="Avatar"
            className="h-[260px] object-contain -mb-2"
          />
        </div>

        <div className="w-3/4 p-6 relative flex items-center">
          <p className="text-lg text-white">
            Welcome to {" "}
            <span className="text-blue-400">Rogue Code</span>{" "}!
          </p>

          <button
            type = "submit"
            className="group absolute bottom-4 right-6 flex items-center gap-2"
          >
            <span className="opacity-30 group-hover:opacity-70 transition text-sm">
              Skip
            </span>
            <span className="text-3xl">{">>>"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
