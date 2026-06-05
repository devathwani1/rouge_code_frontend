import React from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Settings } from "lucide-react";
import {
    useGetAdminSubmissionsListQuery,
    type AdminSubmissionRow,
} from "../../store/api/challengesApi";

function fmtDate(iso: string | null | undefined): string {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch {
        return "—";
    }
}

const AdminSubmissions: React.FC = () => {
    const { data, isLoading, isError, error } = useGetAdminSubmissionsListQuery();

    const totalCount = data?.total_count ?? 0;
    const returned = data?.returned ?? 0;
    const submissions = data?.submissions ?? [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
            <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20">
                                <ClipboardList className="w-6 h-6 text-blue-500" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Submissions
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                            Per–daily-plan-item judge results (passed / total tests, success flag). Newest activity
                            first. Up to 2000 rows loaded; total below includes all records in the database.
                        </p>
                    </div>
                    <Link
                        to="/admin"
                        className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold uppercase tracking-widest text-gray-300 hover:bg-white/10 transition shrink-0"
                    >
                        ← Dashboard
                    </Link>
                </div>
            </header>

            {isError && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-red-400 font-bold mb-1">Failed to load submissions</p>
                    <p className="text-sm text-red-300/80">
                        Staff access required. Ensure <code className="text-red-200">is_staff</code> is enabled.
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
                        Activity
                    </div>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-1">
                        Total submission rows (DB)
                    </p>
                    <p className="text-4xl font-black text-white tabular-nums">{isLoading ? "…" : totalCount}</p>
                    {!isLoading && returned < totalCount && (
                        <p className="text-sm text-amber-400/90 mt-3">
                            Showing <span className="font-bold tabular-nums">{returned}</span> most recent rows (
                            increase API <code className="text-amber-200/80">limit</code> if needed).
                        </p>
                    )}
                </div>
            </section>

            <section className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/15 to-green-600/15 rounded-3xl blur opacity-20 transition duration-1000" />
                <div className="relative bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 lg:p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-purple-400 font-bold tracking-widest text-xs uppercase mb-1">
                                <Settings className="w-3.5 h-3.5" />
                                Log
                            </div>
                            <h2 className="text-xl font-bold text-white">Challenge submissions</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {isLoading ? "Loading…" : `${returned} row${returned === 1 ? "" : "s"} in view`}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="p-16 text-center text-gray-500 animate-pulse font-medium">
                                Loading submissions…
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="p-16 text-center text-gray-500">No submission records yet.</div>
                        ) : (
                            <table className="w-full text-left text-sm min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
                                        <th className="px-4 lg:px-8 py-4 font-bold">When</th>
                                        <th className="px-4 py-4 font-bold">User</th>
                                        <th className="px-4 py-4 font-bold">Question</th>
                                        <th className="px-4 py-4 font-bold hidden lg:table-cell">Plan</th>
                                        <th className="px-4 py-4 font-bold">Result</th>
                                        <th className="px-4 lg:px-8 py-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {submissions.map((s: AdminSubmissionRow) => (
                                        <tr key={s.id} className="hover:bg-white/[0.03] transition">
                                            <td className="px-4 lg:px-8 py-3 align-top text-gray-500 text-xs whitespace-nowrap">
                                                {fmtDate(s.last_submitted_at)}
                                            </td>
                                            <td className="px-4 py-3 align-top">
                                                <p className="text-white font-medium truncate max-w-[160px]">
                                                    {s.user_email}
                                                </p>
                                                <p className="text-gray-500 text-xs font-mono truncate max-w-[160px]">
                                                    @{s.user_username}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 align-top min-w-[200px]">
                                                <p className="text-gray-200 font-medium line-clamp-2">{s.question_title}</p>
                                                <p className="text-[11px] text-gray-500 mt-0.5 capitalize">
                                                    Q: {s.question_difficulty}
                                                    {s.question_slug && (
                                                        <span className="text-gray-600"> · {s.question_slug}</span>
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 align-top text-gray-400 text-xs hidden lg:table-cell whitespace-nowrap">
                                                {s.plan_difficulty ?? "—"}
                                                <span className="text-gray-600"> · Day {s.day_number}</span>
                                                <span className="text-gray-600"> · Item {s.item_order}</span>
                                            </td>
                                            <td className="px-4 py-3 align-top tabular-nums text-gray-300 text-xs whitespace-nowrap">
                                                {s.passed}/{s.total} tests
                                            </td>
                                            <td className="px-4 lg:px-8 py-3 align-top">
                                                {s.success ? (
                                                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-300">
                                                        Success
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-amber-500/15 text-amber-200">
                                                        Incomplete
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminSubmissions;
