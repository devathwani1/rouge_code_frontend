import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Avatar from "../assets/avatar_intro.svg";
import AvatarBox from "../components/AvatarBox";

import { useUpdateProfileMutation, useGetProfileQuery } from "../store/api/profileApi";
import { useGetDifficultiesQuery } from "../store/api/commonApi";

type GravityCardProps = {
  glow: string;
  svgLogo: string;
  title: string;
  difficultyLabel: string;
  difficultyWidth: string;
  questionsWidth: string;
  questionsLabel: string;
  daysLabel: string;
  daysWidth: string;
  accent: string;
  onClick: () => void;
  isLoading: boolean;
};

const GravityCard: React.FC<GravityCardProps> = ({
  glow,
  svgLogo,
  title,
  difficultyLabel,
  difficultyWidth,
  questionsWidth,
  questionsLabel,
  daysLabel,
  daysWidth,
  accent,
  onClick,
  isLoading
}) => {
  return (
    <div style={{ "--glow": glow } as React.CSSProperties}
      onClick={onClick}
      className={`flex flex-col my-4 items-center gap-6 transition-all duration-300 ease-out w-72 ${isLoading ? 'opacity-50 select-none' : 'cursor-pointer hover:scale-105 hover:-translate-y-2 hover:shadow-[0_0_40px_var(--glow)]'}`}>
      <div
        className="w-44 h-44 flex items-center justify-center p-2"
        dangerouslySetInnerHTML={{ __html: svgLogo }}
      />
      <h2 className="text-xl font-bold tracking-wide uppercase">{title}</h2>

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
  const navigate = useNavigate();
  const { data: profile } = useGetProfileQuery();
  const { data: difficulties, isLoading: isDiffLoading } = useGetDifficultiesQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (profile?.difficulty) {
      navigate(`/levels/${profile.difficulty}`);
    }
  }, [profile, navigate]);

  const handleSelect = async (difficultyId: number, name: string) => {
    try {
      await updateProfile({ difficulty: difficultyId }).unwrap();
      navigate(`/levels/${name.toLowerCase()}`);
    } catch (err: any) {
      toast.error(err.data?.message || err.data?.detail || "Failed to update difficulty");
    }
  };

  const getDifficultyConfig = (name: string) => {
    switch (name.toLowerCase()) {
      case "low":
        return {
          glow: "rgba(52,211,153,0.8)",
          accent: "bg-emerald-400",
          diffLabel: "EASY",
          diffWidth: "20%",
        };
      case "standard":
        return {
          glow: "rgba(250, 204, 21, 0.8)",
          accent: "bg-yellow-300",
          diffLabel: "MEDIUM",
          diffWidth: "50%",
        };
      case "crushing":
        return {
          glow: "rgba(239,68,68,0.9)",
          accent: "bg-red-600",
          diffLabel: "HIGH",
          diffWidth: "100%",
        };
      default:
        return {
          glow: "rgba(255,255,255,0.5)",
          accent: "bg-gray-400",
          diffLabel: "UNKNOWN",
          diffWidth: "0%",
        };
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex flex-row gap-12 items-center justify-center p-8">
        {isDiffLoading ? (
          <div className="text-xl animate-pulse opacity-50 font-bold tracking-widest uppercase">
            Synchronizing Levels...
          </div>
        ) : (
          <div className="flex flex-wrap gap-12 justify-center max-w-7xl">
            {difficulties?.map((diff) => {
              const config = getDifficultyConfig(diff.name);
              const qPerDay = Math.ceil(diff.number_of_questions / diff.days);

              return (
                <GravityCard
                  key={diff.id}
                  glow={config.glow}
                  svgLogo={diff.logo}
                  title={`${diff.name} Gravity`}
                  difficultyLabel={config.diffLabel}
                  difficultyWidth={config.diffWidth}
                  questionsLabel={qPerDay.toString()}
                  questionsWidth={`${(qPerDay / 3) * 100}%`}
                  daysLabel={diff.days.toString()}
                  daysWidth={`${(diff.days / 90) * 100}%`}
                  accent={config.accent}
                  onClick={() => !isUpdating && handleSelect(diff.id, diff.name)}
                  isLoading={isUpdating}
                />
              );
            })}
          </div>
        )}
      </div>

      <AvatarBox
        avatar={Avatar}
        onSkip={() => navigate("/levels/low")}
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
