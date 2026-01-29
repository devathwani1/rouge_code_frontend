import React from "react";
import logo from "../assets/logo.svg";
import Avatar from "../assets/avatar_intro.svg";
import AvatarBox from "../components/AvatarBox";

const Intro: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col">
      
      <header className="p-2 bg-[#282828]" >
        <img src={logo} alt="RogueCode" className="w-14" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={logo} alt="Rogue Code Logo" className="w-[260px] mx-auto" />
        <h1 className="text-4xl font-bold tracking-wide">ROGUECODE</h1>
      </div>

      <AvatarBox 
        avatar={Avatar}
        text={
          <>
            Welcome to the{" "}
            <span className="text-blue-400 font-semibold">Rogue Code</span>.

          </>
        }

      />
    </div>
  );
};

export default Intro;
