import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DaysGrid from "../components/DaysGrid";
import { useGetDailyPlansQuery } from "../store/api/challengesApi";
import { useGetProfileQuery } from "../store/api/profileApi";

const LevelsPage = () => {
  const navigate = useNavigate();
  const { difficulty } = useParams<{ difficulty: string }>();
  const { data: dailyPlans, isLoading: isPlansLoading } = useGetDailyPlansQuery();
  const { data: profile, isLoading: isProfileLoading, isFetching: isProfileFetching } = useGetProfileQuery();

  useEffect(() => {
    if (isProfileLoading || isProfileFetching || !profile) return;

    if (!profile.language) {
      navigate("/language", { replace: true });
      return;
    }

    if (!profile.difficulty) {
      navigate("/difficulty", { replace: true });
    }
  }, [profile, isProfileLoading, isProfileFetching, navigate]);

  const isLoading = isPlansLoading || isProfileLoading || isProfileFetching;
  const completedDays =
    dailyPlans?.filter((p) => p.status === "Success").length ?? 0;
  const totalDays = dailyPlans?.length || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl animate-pulse opacity-50 font-bold tracking-widest uppercase">
          Loading Levels...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black px-4 py-8 sm:px-8 sm:py-12 text-white">
      <div className="max-w-7xl mx-auto min-w-0 space-y-8 sm:space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              Path Overview
            </span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500">
            {difficulty?.toUpperCase()} <span className="text-blue-500">LEVELS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg font-medium leading-relaxed">
            Your progressive journey through {difficulty} difficulty problems.
            Complete each day to unlock the next challenge and master the fundamentals.
          </p>
        </header>

        <div className="relative group min-w-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 pointer-events-none" />
          <div className="relative bg-[#111111]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-2xl min-w-0">
            {/* Visual accent — inset so it doesn’t force overflow */}
            <div className="pointer-events-none absolute top-0 right-0 size-48 max-w-full bg-blue-500/5 blur-[100px] rounded-full" />

            <DaysGrid dailyPlans={dailyPlans || []} />
          </div>
        </div>

        <footer className="pt-8 border-t border-white/5 flex flex-wrap gap-8 items-center justify-between text-gray-500 text-sm font-medium">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span>Current Progress: {completedDays}/{totalDays} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span>Passed day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span>Failed day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <span>Upcoming</span>
            </div>
          </div>
          <p className="uppercase tracking-[0.1em] text-[10px] font-bold">RogueCode Challenge Engine v1.0</p>
        </footer>
      </div>
    </div>
  );
};

export default LevelsPage;
