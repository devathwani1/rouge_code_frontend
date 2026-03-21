import React, { useMemo } from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import { useGetRecentQuestionAttemptsQuery } from "../store/api/challengesApi";
import { useGetProfileStatsQuery } from "../store/api/profileApi";
import { getDifficultySvgHtml } from "../utils/difficultySvgs";
import liveHeart from "../assets/live_heart.png";
import deadHeart from "../assets/dead_heart.png";

function formatAttemptAgo(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const diffMs = Date.now() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 48) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 14) return `${days}d ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function difficultyLabel(d: string): string {
  const m: Record<string, string> = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };
  return m[d.toLowerCase()] ?? d;
}

const Profile: React.FC = () => {
  const { data, isLoading, error } = useGetProfileStatsQuery(undefined as void);
  const {
    data: recentAttempts = [],
    isLoading: recentLoading,
    isError: recentError,
  } = useGetRecentQuestionAttemptsQuery(6);

  const hearts = useMemo(() => {
    const lives = data?.lives ?? 0;
    const maxLives = data?.max_lives ?? 3;
    return Array.from({ length: maxLives }, (_, i) => i < lives);
  }, [data?.lives, data?.max_lives]);

  const solvedText = useMemo(() => {
    const solved = data?.solved ?? 0;
    const total = data?.total_questions ?? 0;
    return `${solved}/${total}`;
  }, [data?.solved, data?.total_questions]);

  const dayResultsByNumber = useMemo(() => {
    const m = new Map<number, boolean>();
    for (const d of data?.day_results ?? []) {
      m.set(d.day_number, d.success);
    }
    return m;
  }, [data?.day_results]);

  const { survivedDayCount, fallenDayCount } = useMemo(() => {
    let survived = 0;
    let fallen = 0;
    for (const d of data?.day_results ?? []) {
      if (d.success) survived += 1;
      else fallen += 1;
    }
    return { survivedDayCount: survived, fallenDayCount: fallen };
  }, [data?.day_results]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-white flex items-center justify-center">
        <div className="text-xl animate-pulse opacity-50 font-bold tracking-widest uppercase">
          Loading Profile...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-red-300 flex items-center justify-center">
        <div className="text-xl font-bold">Failed to load profile</div>
      </div>
    );
  }

  const totalDays = data.total_days;
  const streak = data.streak;
  const solvedPercent = data.solved_percent;
  const difficultySvg = getDifficultySvgHtml(data.difficulty ?? undefined);

  return (
    <div className="min-h-screen w-full bg-[#0b0f14] text-white overflow-x-hidden pt-4">
      <div className="w-full max-w-none mx-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: profile summary card */}
          <div className="lg:col-span-1 bg-black/40 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              {difficultySvg ? (
                <div
                  className="flex-shrink-0 pointer-events-none select-none [&_svg]:block [&_svg]:h-auto [&_svg]:w-auto [&_svg]:max-h-[76px]"
                  dangerouslySetInnerHTML={{ __html: difficultySvg }}
                  aria-hidden
                />
              ) : (
                <div
                  style={{ width: 46, height: 46 }}
                  className="overflow-hidden bg-gradient-to-br from-indigo-500/40 to-purple-600/40 border border-white/10 shadow-lg flex items-center justify-center flex-shrink-0 rounded-full"
                >
                  <span
                    className="text-xl font-black text-white select-none"
                    style={{
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {(data.username || data.email || "U").trim().charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <div className="text-lg font-bold truncate">
                  {data.username || data.email}
                </div>
                {data.email &&
                  (data.username || "").trim().toLowerCase() !== (data.email || "").trim().toLowerCase() && (
                    <div className="text-sm text-white/60 truncate">{data.email}</div>
                  )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                {data.language?.toUpperCase() ?? "PYTHON"}
              </span>
              {data.difficulty && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {data.difficulty}
                </span>
              )}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="text-xs text-white/50 uppercase font-bold tracking-widest mb-3">
                Recently attempted
              </div>
              {recentLoading ? (
                <div className="text-sm text-white/40 animate-pulse">Loading…</div>
              ) : recentError ? (
                <div className="text-sm text-red-400/80">Could not load recent attempts.</div>
              ) : recentAttempts.length === 0 ? (
                <div className="text-sm text-white/45">No submissions yet.</div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {recentAttempts.map((row) => (
                    <li key={row.question_id}>
                      <Link
                        to={`/question/${row.question_id}`}
                        className="block rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:bg-white/[0.06] hover:border-white/15 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-semibold text-white/95 line-clamp-2 min-w-0">
                            {row.title}
                          </span>
                          <span
                            className={`shrink-0 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              row.last_success
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/15 text-amber-200/90"
                            }`}
                          >
                            {row.last_success ? "AC" : `${row.last_passed}/${row.last_total}`}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-white/45">
                          <span>{difficultyLabel(row.difficulty)}</span>
                          <span className="text-white/25">·</span>
                          <span>{formatAttemptAgo(row.last_attempted_at)}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: stats cards */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Available cores */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/60 uppercase font-bold tracking-widest">
                    Available Cores
                  </div>
                  <div className="text-2xl font-extrabold">
                    {data.lives}/{data.max_lives}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {hearts.map((isLive, idx) => (
                    <div
                      key={idx}
                      className="h-[4.5rem] w-[4.5rem] flex items-center justify-center shrink-0"
                    >
                      <img
                        src={isLive ? liveHeart : deadHeart}
                        alt={isLive ? "Live core" : "Dead core"}
                        className="max-h-full max-w-full w-auto h-auto object-contain object-center"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>

       
            </div>

            {/* Survived days — grid from closed-day results: green = cleared, red = failed */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="text-sm text-white/60 uppercase font-bold tracking-widest">
                    Survived Days
                  </div>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="text-2xl font-extrabold tabular-nums">
                      <span className="text-emerald-400">{survivedDayCount}</span>
                      <span className="text-white/40 font-semibold mx-1">/</span>
                      <span className="text-red-400">{fallenDayCount}</span>
                    </span>
                    <span className="text-sm text-white/50">
                      <span className="text-emerald-400/90 font-semibold">cleared</span>
                      {" · "}
                      <span className="text-red-400/90 font-semibold">lost</span>
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-white/55">
                    Current streak{" "}
                    <span className="text-white font-bold tabular-nums">{streak}</span>
                    <span className="text-white/35"> / </span>
                    <span className="text-white/70">{totalDays}</span> days
                  </div>
                </div>
                <div className="text-sm text-white/60 shrink-0">
                  Max streak <span className="text-white font-bold">{data.max_streak}</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}>
                  {Array.from({ length: totalDays }, (_, i) => {
                    const dayNum = i + 1;
                    const closed = dayResultsByNumber.has(dayNum);
                    const success = dayResultsByNumber.get(dayNum);
                    let boxClass = "bg-white/5 border border-white/5";
                    let title = `Day ${dayNum}: not closed yet`;
                    if (closed && success === true) {
                      boxClass =
                        "bg-emerald-500/85 border border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.35)]";
                      title = `Day ${dayNum}: cleared`;
                    } else if (closed && success === false) {
                      boxClass =
                        "bg-red-600/85 border border-red-400/45 shadow-[0_0_8px_rgba(220,38,38,0.35)]";
                      title = `Day ${dayNum}: lost`;
                    }
                    return (
                      <div
                        key={dayNum}
                        title={title}
                        className={`h-5 rounded-[3px] ${boxClass}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Solved — ring + difficulty breakdown */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-10">
                <div className="w-44 h-44 shrink-0">
                  <CircularProgressbarWithChildren
                    value={Math.min(100, Math.max(0, solvedPercent))}
                    strokeWidth={9}
                    styles={buildStyles({
                      pathColor: "#3b82f6",
                      pathTransitionDuration: 0.65,
                      trailColor: "rgba(255,255,255,0.08)",
                      strokeLinecap: "round",
                    })}
                  >
                    <div className="flex flex-col items-center justify-center text-center px-3 -mt-1 pointer-events-none">
                      <div className="text-2xl font-extrabold tabular-nums leading-tight text-white">
                        {solvedText}
                      </div>
                      <div className="text-[11px] text-white/55 font-bold uppercase tracking-widest mt-0.5">
                        Solved
                      </div>
                    </div>
                  </CircularProgressbarWithChildren>
                </div>

                <div className="flex flex-col gap-3 min-w-[10rem] w-full sm:w-auto">
                  <div className="text-xs text-white/50 uppercase font-bold tracking-widest">
                    By difficulty
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center justify-between gap-6 border-b border-white/10 pb-2">
                      <span className="text-emerald-400/90 font-semibold">Easy</span>
                      <span className="tabular-nums font-bold text-white">
                        {data.solved_easy ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-6 border-b border-white/10 pb-2">
                      <span className="text-amber-400/90 font-semibold">Medium</span>
                      <span className="tabular-nums font-bold text-white">
                        {data.solved_medium ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-6">
                      <span className="text-red-400/90 font-semibold">Hard</span>
                      <span className="tabular-nums font-bold text-white">
                        {data.solved_hard ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

