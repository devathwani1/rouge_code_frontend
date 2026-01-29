import React from "react";
import logo from "../assets/logo.svg";
import Avatar from "../assets/avatar_intro.svg";
import AvatarBox from "../components/AvatarBox";
import easy from "../assets/easy.svg";
import medium from "../assets/medium.svg";
import hard from "../assets/hard.svg";

type GravityCardProps = {
  glow: string;
  icon:string;
  title: string;
  difficultyLabel: string;
  difficultyWidth: string;
  questionsWidth: string;
  questionsLabel: string;
  daysLabel: string;
  daysWidth: string;
  accent: string;
};

const GravityCard: React.FC<GravityCardProps> = ({
  glow,
  icon,
  title,
  difficultyLabel,
  difficultyWidth,
  questionsWidth,
  questionsLabel,
  daysLabel,
  daysWidth,
  accent,
}) => {
  return (
    <div style={{ "--glow": glow } as React.CSSProperties}
    className="flex flex-col my-4 items-center gap-6 cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:shadow-[0_0_40px_var(--glow)]">
        <img src={icon} alt={title} className="w-40 h-40 object-contain"/>
        <h2 className="text-xl font-bold tracking-wide">{title}</h2>

      <div className="w-64 text-sm space-y-3">
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="opacity-70">DIFFICULTY</span>
            <span>{difficultyLabel}</span>
          </div>
          <div className="h-2 bg-gray-700">
            <div className={`h-2 ${accent}`} style={{ width: difficultyWidth }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="opacity-70">QUESTIONS / DAY</span>
            <span>{questionsLabel}</span>
          </div>
          <div className="h-2 bg-gray-700">
            <div className={`h-2 ${accent}`} style={{ width: questionsWidth }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="opacity-70">DAYS</span>
            <span>{daysLabel}</span>
          </div>
          <div className="h-2 bg-gray-700">
            <div className={`h-2 ${accent}`} style={{ width: daysWidth }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Difficulty: React.FC = () => {

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="p-2 bg-[#282828]" >
        <img src={logo} alt="RogueCode" className="w-14" />
      </header>
      <div className="flex-1 flex flex-row gap-24 items-center justify-center">
        <div className="flex group gap-24">
          <GravityCard
            glow="rgba(52,211,153,0.8)"
            icon={easy}
            title="LOW GRAVITY"
            difficultyLabel="EASY"
            difficultyWidth="20%"
            questionsLabel="1"
            daysLabel="90"
            questionsWidth="20%"
            daysWidth="100%"
            accent="bg-emerald-400"
          />

          <GravityCard
            glow="rgba(250, 204, 21, 0.8)"
            icon={medium}
            title="STANDARD GRAVITY"
            difficultyLabel="MEDIUM"
            difficultyWidth="50%"
            questionsLabel="2"
            questionsWidth="50%"
            daysLabel="45"
            daysWidth="50%"
            accent="bg-yellow-300"
          />

          <GravityCard
            glow="rgba(239,68,68,0.9)"
            icon={hard}
            title="CRUSHING GRAVITY"
            difficultyLabel="HIGH"
            difficultyWidth="100%"
            questionsLabel="3"
            questionsWidth="100%"
            daysLabel="30"
            daysWidth="20%"
            accent="bg-red-600"
          />
        </div>

      </div>

      <AvatarBox 
        avatar={Avatar}
        text={
          <>
            Pick the{" "}
            <span className="text-blue-400 font-semibold">difficulty</span>{" "}
            you want to suffer!
          </>
        }

      />
    </div>
  );
};

export default Difficulty;
