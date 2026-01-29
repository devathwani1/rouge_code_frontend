import React from "react";
import logo from "../assets/logo.svg";
import Avatar from "../assets/avatar_intro.svg";
import AvatarBox from "../components/AvatarBox";
import python from "../assets/python.svg";
import java from "../assets/java.svg";
import cpp from "../assets/cpp.svg";

const Language: React.FC = () => {

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-2 bg-[#282828]" >
        <img src={logo} alt="RogueCode" className="w-14" />
      </header>
      <div className="flex-1 flex flex-row gap-24 items-center justify-center">
        <div className="bg-[#1A1A1A] w-48 h-48 rounded-full border-4 border-blue-500 flex items-center justify-center cursor-pointer hover:scale-105 hover:border-blue-400 transition">
          <img src={python} alt="Python" className="w-20" />
        </div>

        <div className="bg-[#1A1A1A] w-48 h-48 rounded-full border-4 border-blue-500 flex items-center justify-center cursor-pointer hover:scale-105 hover:border-blue-400 transition">
          <img src={java} alt="Java" className="w-20" />
        </div>

        <div className="bg-[#1A1A1A] w-48 h-48 rounded-full border-4 border-blue-500 flex items-center justify-center cursor-pointer hover:scale-105 hover:border-blue-400 transition" >
          <img src={cpp} alt="C++" className="w-20" />
        </div>

      </div>

      <AvatarBox 
        avatar={Avatar}
        text={
          <>
            Pick the language that suits your{" "}
            <span className="text-blue-400 font-semibold">strength</span>!
          </>
        }

      />
    </div>
  );
};

export default Language;
