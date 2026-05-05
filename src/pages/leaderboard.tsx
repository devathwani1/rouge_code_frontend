import { useEffect, useMemo, useState } from "react";
import { useGetLeaderboardQuery } from "../store/api/profileApi";
import { useGetDifficultiesQuery } from "../store/api/commonApi";

const LeaderboardPage = () => {
  const { data, isLoading } = useGetLeaderboardQuery();
  const { data: difficulties } = useGetDifficultiesQuery();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  useEffect(() => {
    if (!selectedDifficulty && difficulties && difficulties.length > 0) {
      setSelectedDifficulty(difficulties[0].name);
    }
  }, [difficulties, selectedDifficulty]);

  const filteredRows = useMemo(() => {
    if (!data || !selectedDifficulty) return [];
    return data.filter((row) => row.difficulty === selectedDifficulty);
  }, [data, selectedDifficulty]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl animate-pulse opacity-50 font-bold tracking-widest uppercase">
          Loading Leaderboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black px-4 py-8 sm:px-8 sm:py-12 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              <span className="text-blue-500">{selectedDifficulty || "Difficulty"}</span> Leaderboard
            </h1>
            <p className="text-gray-400">Only non-staff players for the selected difficulty are shown.</p>
          </div>
          <div className="sm:pt-2 sm:self-start">
            <label className="block text-xs uppercase tracking-wide text-white/60 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-52 rounded-lg bg-[#101010] border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(difficulties || []).map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-white/5 text-white/80 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Difficulty</th>
                <th className="px-4 py-3 text-left">Level</th>
                <th className="px-4 py-3 text-left">Streak</th>
                <th className="px-4 py-3 text-left">Max Streak</th>
                <th className="px-4 py-3 text-left">Day</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => (
                <tr key={row.user_id} className="border-t border-white/5 hover:bg-white/[0.04]">
                  <td className="px-4 py-3 font-semibold text-blue-300">#{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.username || row.email}</div>
                    <div className="text-xs text-white/50">{row.email}</div>
                  </td>
                  <td className="px-4 py-3">{row.difficulty || "-"}</td>
                  <td className="px-4 py-3">{row.level}</td>
                  <td className="px-4 py-3">{row.streak}</td>
                  <td className="px-4 py-3">{row.max_streak}</td>
                  <td className="px-4 py-3">{row.challenge_day}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-white/60" colSpan={7}>
                    No players found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
