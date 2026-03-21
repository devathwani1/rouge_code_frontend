import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import Avatar from "../assets/avatar_intro.svg";
import AvatarBox from "../components/AvatarBox";
import { useGetProfileQuery } from "../store/api/profileApi";

const dialogues = [
  "Welcome to Rogue Code !",
  "This is not a practice platform. This is a survival.",
  "Every day, you will be given a fixed set of coding challenges — based on the difficulty you choose.",
  "You get three lives.",
  "Fail to complete your daily challenge, and you lose one.",
  "Fail three days in a row…",
  "…and everything resets. No streak hacks. No binge solving. No shortcuts.",
  "Progress here is earned only through consistency.",
  "Solve daily. Survive longer. Go deeper.",
  "Are you ready to start your run?"
];

const Intro: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { data: profile } = useGetProfileQuery();

  useEffect(() => {
    if (profile) {
      if (profile.language && profile.difficulty) {
        navigate(`/levels/${profile.difficulty}`);
      } else if (profile.language) {
        navigate("/difficulty");
      }
    }
  }, [profile, navigate]);

  const handleNext = () => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    navigate("/language");
  };

  return (
    <div
      className="min-h-screen bg-[#1c1c1c] text-white flex flex-col cursor-pointer select-none"
      onClick={handleNext}
    >

      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={logo} alt="Rogue Code Logo" className="w-[260px] mx-auto" />
        <h1 className="text-4xl font-bold tracking-wide">ROGUECODE</h1>
      </div>

      <AvatarBox
        avatar={Avatar}
        text={
          <>
            {dialogues[currentIndex].split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < dialogues[currentIndex].split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </>
        }
        onSkip={handleSkip}
      />
    </div>
  );
};

export default Intro;
