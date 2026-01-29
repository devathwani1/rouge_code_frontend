import React from "react";
import Sidebar from "../components/Sidebar";
import AddQuestion from "./admin/AddQuestion";
import AdminDashboard from "./admin/AdminDashboard";
import { useLocation } from "react-router-dom";

const Admin: React.FC = () => {
    const location = useLocation();

    // Decide which component to show based on the path
    const renderContent = () => {
        if (location.pathname === "/admin/questions") {
            return <AddQuestion />;
        }
        // Default to dashboard
        return <AdminDashboard />;
    };

    return (
        <div className="flex h-screen bg-[#0b0f14] text-white">
            <Sidebar />

            <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;
