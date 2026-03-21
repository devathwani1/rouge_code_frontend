import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import evatarDead from "../assets/evatar_dead.png";
import {
  useGetProfileStatsQuery,
  useResetRunMutation,
} from "../store/api/profileApi";

const DIALOGUES = [
  "Oh.... 3 Cores Destroyed...",
  "DELETING ALL YOUR PROGRESS!!!",
] as const;

/** Matches reference: flat light gray (#D9D9D9) */
const BUBBLE = "#D9D9D9";

type Phase = "dialogue" | "resetting" | "flash";

function GameOverSpeechBubble({
  children,
  dimmed,
  dangerText,
}: {
  children: React.ReactNode;
  dimmed?: boolean;
  /** Second dialogue: red warning text */
  dangerText?: boolean;
}) {
  return (
    <div
      className={`relative w-full max-w-xl mx-auto flex flex-col items-center ${dimmed ? "opacity-50" : ""}`}
    >
      {/* Main box */}
      <div
        className="w-full px-6 py-5 sm:px-8 sm:py-6 min-h-[5.5rem] flex items-center justify-center"
        style={{
          backgroundColor: BUBBLE,
          borderRadius: 0,
        }}
      >
        <p
          className={`text-center text-base sm:text-lg font-semibold leading-snug tracking-tight ${
            dangerText
              ? "text-red-600 font-extrabold"
              : "text-[#111]"
          }`}
        >
          {children}
        </p>
      </div>
      {/* Downward tail — points at avatar */}
      <div
        className="flex justify-center w-full"
        style={{ marginTop: -1 }}
        aria-hidden
      >
        <div
          className="w-0 h-0 border-x-[14px] border-x-transparent border-t-[18px]"
          style={{ borderTopColor: BUBBLE }}
        />
      </div>
    </div>
  );
}

/**
 * Full-screen game over: tap through dialogues, POST reset-run, flash, then profile.
 */
const GameOver: React.FC = () => {
  const navigate = useNavigate();
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("dialogue");
  const { data: stats, isLoading, isError } = useGetProfileStatsQuery();
  const [resetRun] = useResetRunMutation();

  const dialogueText = useMemo(
    () => DIALOGUES[lineIndex] ?? DIALOGUES[0],
    [lineIndex]
  );

  useEffect(() => {
    if (stats && stats.lives > 0) {
      navigate("/profile", { replace: true });
    }
  }, [stats, navigate]);

  const runResetAndFinish = useCallback(async () => {
    setPhase("resetting");
    try {
      await resetRun().unwrap();
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object" &&
        "message" in err.data
          ? String((err.data as { message?: string }).message)
          : "Could not reset your run.";
      toast.error(msg);
      setPhase("dialogue");
      setLineIndex(DIALOGUES.length - 1);
      return;
    }
    setPhase("flash");
    await new Promise((r) => setTimeout(r, 720));
    navigate("/profile", { replace: true });
  }, [navigate, resetRun]);

  const handleAdvance = useCallback(async () => {
    if (phase !== "dialogue") return;
    if (lineIndex < DIALOGUES.length - 1) {
      setLineIndex((i) => i + 1);
      return;
    }
    await runResetAndFinish();
  }, [phase, lineIndex, runResetAndFinish]);

  const bubbleContent =
    phase === "resetting"
      ? "Hang tight…"
      : phase === "flash"
        ? ""
        : dialogueText;

  if (isLoading || !stats) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0b0f14] text-white flex items-center justify-center">
        <div className="text-xl animate-pulse opacity-50 font-bold tracking-widest uppercase">
          Loading…
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0b0f14] text-red-300 flex items-center justify-center px-6 text-center">
        Could not load your profile. Try again from the profile page.
      </div>
    );
  }

  if (stats.lives > 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] min-h-screen flex flex-col bg-[#05080c]/95 backdrop-blur-md text-white cursor-pointer select-none overflow-hidden"
      onClick={() => void handleAdvance()}
      role="presentation"
    >
      {phase === "flash" && (
        <div
          className="fixed inset-0 z-[120] pointer-events-none bg-white game-over-flash-overlay"
          aria-hidden
        />
      )}

      {phase === "resetting" && (
        <div
          className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center cursor-wait"
          onClick={(e) => e.stopPropagation()}
          role="status"
          aria-live="polite"
        >
          <div className="text-lg font-bold tracking-widest uppercase text-white/90 animate-pulse">
            Deleting progress…
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 pt-16 pb-6">
        <div className="w-full max-w-lg flex flex-col items-center gap-0">
          <GameOverSpeechBubble
            dimmed={phase !== "dialogue"}
            dangerText={phase === "dialogue" && lineIndex === 1}
          >
            {bubbleContent}
          </GameOverSpeechBubble>

          <img
            src={evatarDead}
            alt=""
            className="w-full max-w-md max-h-[42vh] sm:max-h-[48vh] object-contain object-bottom mt-1 drop-shadow-[0_0_40px_rgba(220,38,38,0.2)]"
          />
        </div>
      </div>

      {phase === "dialogue" && (
        <p className="text-center text-xs text-white/35 pb-6 pointer-events-none shrink-0">
          Tap anywhere to continue
        </p>
      )}
    </div>
  );
};

export default GameOver;
