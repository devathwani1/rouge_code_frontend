import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Settings, Trash2, Pencil } from "lucide-react";
import {
    useGetAdminQuestionsListQuery,
    useDeleteQuestionMutation,
    type QuestionData,
} from "../../store/api/challengesApi";

const AdminDashboard: React.FC = () => {
    const { data, isLoading, isError, error } = useGetAdminQuestionsListQuery();
    const [deleteQuestion, { isLoading: deletingId }] = useDeleteQuestionMutation();
    const [pendingDelete, setPendingDelete] = useState<string | null>(null);

    const count = data?.count ?? 0;
    const questions = data?.questions ?? [];

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setPendingDelete(id);
        try {
            await deleteQuestion(id).unwrap();
        } catch (e) {
            console.error(e);
        } finally {
            setPendingDelete(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
            <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20">
                                <Settings className="w-6 h-6 text-blue-500" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Admin Dashboard
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                            Overview of arena challenges. Manage questions from this hub.
                        </p>
                    </div>
                    <Link
                        to="/admin/questions"
                        className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold uppercase tracking-widest transition shadow-lg shadow-blue-900/20 shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        Add question
                    </Link>
                </div>
            </header>

            {isError && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-red-400 font-bold mb-1">Failed to load questions</p>
                    <p className="text-sm text-red-300/80">
                        Staff access is required for the admin list. Ensure your account has{" "}
                        <code className="text-red-200">is_staff</code> in Django admin.
                    </p>
                    <pre className="mt-2 text-xs text-red-300/60 whitespace-pre-wrap overflow-auto max-h-40">
                        {JSON.stringify((error as { data?: unknown })?.data ?? error, null, 2)}
                    </pre>
                </div>
            )}

            <section className="group relative mb-10">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-black/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 lg:p-10 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold tracking-widest text-xs uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Database
                    </div>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-1">
                        Total questions
                    </p>
                    <p className="text-4xl font-black text-white tabular-nums">
                        {isLoading ? "…" : count}
                    </p>
                </div>
            </section>

            <section className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/15 to-green-600/15 rounded-3xl blur opacity-20 transition duration-1000" />
                <div className="relative bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 lg:p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-purple-400 font-bold tracking-widest text-xs uppercase mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                Question catalog
                            </div>
                            <h2 className="text-xl font-bold text-white">All questions</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {isLoading ? "Loading…" : `${questions.length} loaded`}
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {isLoading ? (
                            <div className="p-16 text-center text-gray-500 animate-pulse font-medium">
                                Loading questions…
                            </div>
                        ) : questions.length === 0 ? (
                            <div className="p-16 text-center text-gray-500">
                                No questions yet.{" "}
                                <Link to="/admin/questions" className="text-blue-400 hover:text-blue-300 font-semibold">
                                    Create one
                                </Link>
                                .
                            </div>
                        ) : (
                            questions.map((q: QuestionData) => (
                                <div
                                    key={q.id}
                                    className="p-6 lg:px-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-white/[0.03] transition"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-lg text-white truncate">{q.title}</p>
                                        <p className="text-sm text-gray-500 mt-1 capitalize">
                                            {q.difficulty} · <span className="font-mono text-gray-400">{q.function_name}()</span>
                                            {q.slug && (
                                                <>
                                                    {" "}
                                                    · <span className="text-gray-600">{q.slug}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 shrink-0">
                                        <Link
                                            to={`/admin/questions/edit/${q.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-bold text-gray-200 hover:bg-blue-600/20 hover:border-blue-500/30 hover:text-blue-200 transition"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Update
                                        </Link>
                                        <button
                                            type="button"
                                            disabled={pendingDelete === q.id || deletingId}
                                            onClick={() => q.id && handleDelete(q.id, q.title)}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-300 hover:bg-red-500/20 transition disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {pendingDelete === q.id ? "Deleting…" : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
