import React from "react";
import { useListQuestionsQuery } from "../../store/api/challengesApi";

const AdminDashboard: React.FC = () => {
    const { data: questions, isLoading } = useListQuestionsQuery();

    return (
        <div>
            <header className="mb-10">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-400">Overview of your arena challenges and activity.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black/40 border border-blue-900/20 p-6 rounded-2xl">
                    <p className="text-gray-500 font-bold uppercase text-xs mb-1">Total Questions</p>
                    <p className="text-3xl font-bold text-blue-400">{questions?.status === true ? questions.data.length : 0}</p>
                </div>
                {/* Add more stats card here */}
            </div>

            <section className="bg-black/40 border border-blue-900/20 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Active Questions</h2>
                    <button className="text-blue-500 hover:text-blue-400 text-sm font-bold">View All</button>
                </div>
                <div className="divide-y divide-gray-800">
                    {isLoading ? (
                        <div className="p-10 text-center text-gray-500">Loading questions...</div>
                    ) : (
                        questions?.data?.map((q: any) => (
                            <div key={q.id} className="p-6 flex justify-between items-center hover:bg-white/5 transition">
                                <div>
                                    <p className="font-semibold text-lg">{q.title}</p>
                                    <p className="text-sm text-gray-500 capitalize">{q.difficulty} • {q.function_name}()</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition">Edit</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
