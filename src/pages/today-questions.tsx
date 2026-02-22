import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDailyPlanItemsQuery } from "../store/api/challengesApi";
import logo from "../assets/logo.svg";

const TodayQuestions: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { data: items, isLoading, error } = useGetDailyPlanItemsQuery(planId!);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl animate-pulse opacity-50 font-bold tracking-widest uppercase">
                    Loading Questions...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-red-500 font-bold uppercase tracking-widest">
                    Failed to load questions
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black p-12 text-white">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 backdrop-blur-sm">
                                Daily Mission
                            </span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            TODAY'S <span className="text-indigo-500 text-glow">TASKS</span>
                        </h1>
                    </div>
                    <img src={logo} alt="RogueCode" className="w-12 h-12 opacity-50 hover:opacity-100 transition-opacity" />
                </header>

                <div className="grid gap-6">
                    {items?.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/question/${item.id}`)}
                            className="group relative bg-[#111111]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 cursor-pointer hover:bg-[#1a1a1a]/60 hover:border-indigo-500/30 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                                        {item.order}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                            {item.title}
                                        </h3>
                                        <div className="flex gap-3 items-center">
                                            <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded ${item.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-400/10' :
                                                item.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10' :
                                                    'text-red-400 bg-red-400/10'
                                                }`}>
                                                {item.difficulty}
                                            </span>
                                            <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest">• 80XP REWARD</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-indigo-400 group-hover:translate-x-[-10px] transition-all">
                                        Initialize Solution
                                    </span>
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {items?.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl opacity-30">
                            <p className="font-black uppercase tracking-[0.3em]">No modules detected for this sector</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="text-xs font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors flex items-center gap-2"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 rotate-180 fill-current">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                    Return to Hub
                </button>
            </div>
        </div>
    );
};

export default TodayQuestions;
