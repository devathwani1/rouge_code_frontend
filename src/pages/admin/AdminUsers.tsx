import React from "react";
import { Link } from "react-router-dom";
import { Users, Settings } from "lucide-react";
import { useGetAdminUsersListQuery } from "../../store/api/authApi";
import type { AdminUserRow } from "../../store/api/authApi";

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

const AdminUsers: React.FC = () => {
    const { data, isLoading, isError, error } = useGetAdminUsersListQuery();

    const count = data?.count ?? 0;
    const users = data?.users ?? [];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
            <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Users
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                            All registered accounts and linked challenge profiles (staff only).
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
                    <p className="text-red-400 font-bold mb-1">Failed to load users</p>
                    <p className="text-sm text-red-300/80">
                        Staff access required. Ensure <code className="text-red-200">is_staff</code> is enabled for your
                        account.
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
                        Accounts
                    </div>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-1">
                        Total users
                    </p>
                    <p className="text-4xl font-black text-white tabular-nums">{isLoading ? "…" : count}</p>
                </div>
            </section>

            <section className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/15 to-green-600/15 rounded-3xl blur opacity-20 transition duration-1000" />
                <div className="relative bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-8 lg:p-10 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-purple-400 font-bold tracking-widest text-xs uppercase mb-1">
                                <Settings className="w-3.5 h-3.5" />
                                Directory
                            </div>
                            <h2 className="text-xl font-bold text-white">All users</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {isLoading ? "Loading…" : `${users.length} loaded`}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <div className="p-16 text-center text-gray-500 animate-pulse font-medium">
                                Loading users…
                            </div>
                        ) : users.length === 0 ? (
                            <div className="p-16 text-center text-gray-500">No users found.</div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
                                        <th className="px-6 lg:px-10 py-4 font-bold">User</th>
                                        <th className="px-4 py-4 font-bold hidden lg:table-cell">Roles</th>
                                        <th className="px-4 py-4 font-bold hidden md:table-cell">Profile</th>
                                        <th className="px-4 py-4 font-bold hidden xl:table-cell">Joined</th>
                                        <th className="px-6 lg:px-10 py-4 font-bold hidden sm:table-cell">Last login</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((u: AdminUserRow) => (
                                        <tr key={u.user_id} className="hover:bg-white/[0.03] transition">
                                            <td className="px-6 lg:px-10 py-4 align-top">
                                                <p className="font-semibold text-white truncate max-w-[200px] lg:max-w-xs">
                                                    {u.email}
                                                </p>
                                                <p className="text-gray-500 text-xs mt-0.5 font-mono truncate max-w-[200px] lg:max-w-xs">
                                                    @{u.username}
                                                </p>
                                                <p className="text-gray-500 text-xs mt-0.5">
                                                    Age {u.age ?? "—"}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 mt-2 lg:hidden">
                                                    {u.is_superuser && (
                                                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                                            Super
                                                        </span>
                                                    )}
                                                    {u.is_staff && !u.is_superuser && (
                                                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                                                            Staff
                                                        </span>
                                                    )}
                                                    {!u.is_active && (
                                                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                                                            Inactive
                                                        </span>
                                                    )}
                                                    {u.is_verified ? (
                                                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-600/30 text-gray-400">
                                                            Unverified
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top hidden lg:table-cell">
                                                <div className="flex flex-col gap-1">
                                                    {u.is_superuser && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 w-fit">
                                                            Superuser
                                                        </span>
                                                    )}
                                                    {u.is_staff && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 w-fit">
                                                            Staff
                                                        </span>
                                                    )}
                                                    {!u.is_active && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-red-500/20 text-red-300 w-fit">
                                                            Inactive
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md w-fit ${
                                                            u.is_verified
                                                                ? "bg-emerald-500/15 text-emerald-400"
                                                                : "bg-gray-600/30 text-gray-400"
                                                        }`}
                                                    >
                                                        {u.is_verified ? "Verified" : "Unverified"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top text-gray-400 hidden md:table-cell">
                                                <p className="text-xs">
                                                    {u.language?.toUpperCase() ?? "—"}{" "}
                                                    {u.difficulty && (
                                                        <span className="text-gray-500">· {u.difficulty}</span>
                                                    )}
                                                </p>
                                                <p className="text-xs mt-1 tabular-nums">
                                                    Day {u.challenge_day ?? "—"} · Lives {u.lives ?? "—"} · Streak{" "}
                                                    {u.streak ?? "—"}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 align-top text-gray-500 text-xs hidden xl:table-cell whitespace-nowrap">
                                                {fmtDate(u.date_joined)}
                                            </td>
                                            <td className="px-6 lg:px-10 py-4 align-top text-gray-500 text-xs hidden sm:table-cell whitespace-nowrap">
                                                {fmtDate(u.last_login)}
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

export default AdminUsers;
