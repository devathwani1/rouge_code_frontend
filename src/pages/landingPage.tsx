import React from "react";
import logo from "../assets/logo.svg";
import avatar from "../assets/avatar_intro.png";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#111111] text-white relative flex flex-col">
      
      {/* ───────── TOP BAR ───────── */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700">
        <img src={logo} alt="RC Logo" className="w-12" />

        {/* MENU BOX */}
        <div className="border border-white px-5 py-2 rounded-md text-sm cursor-pointer hover:bg-white hover:text-black transition">
          Menu
        </div>
      </div>

      {/* ───────── CENTER LOGO ───────── */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={logo} alt="RogueCode" className="w-40 mb-6" />
        <h1 className="text-4xl font-bold tracking-widest">ROGUECODE</h1>
      </div>

      {/* ───────── INTRO BOX ───────── */}
      <div className="px-10 pb-10">
        <div className="border-2 border-white flex items-center justify-between p-6 rounded-md">
          
          {/* AVATAR DIV */}
          <div className="w-1/4 flex justify-center">
            <img
              src={avatar}
              alt="Avatar"
              className="w-28"
            />
          </div>

          {/* TEXT DIV */}
          <div className="w-2/4 text-lg">
            <span className="text-white">
              Welcome to{" "}
              <span className="text-blue-400 font-semibold">
                Rogue Code
              </span>{" "}
              !
            </span>
          </div>

          {/* SIGN IN ARROW */}
          <div className="w-1/4 flex justify-end">
            <button className="text-4xl hover:text-blue-400 transition">
              →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
