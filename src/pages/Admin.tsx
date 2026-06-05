import React from "react";
import Sidebar from "../components/Sidebar";
import AddQuestion from "./admin/AddQuestion";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminSubmissions from "./admin/AdminSubmissions";
import { useLocation } from "react-router-dom";

const Admin: React.FC = () => {
    const location = useLocation();

    const renderContent = () => {
        const editPrefix = "/admin/questions/edit/";
        if (location.pathname.startsWith(editPrefix)) {
            const id = location.pathname.slice(editPrefix.length).split("/")[0];
            if (id) {
                return <AddQuestion editQuestionId={id} />;
            }
        }
        if (location.pathname === "/admin/questions") {
            return <AddQuestion />;
        }
        if (location.pathname === "/admin/users") {
            return <AdminUsers />;
        }
        if (location.pathname === "/admin/submissions") {
            return <AdminSubmissions />;
        }
        return <AdminDashboard />;
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] bg-[#0b0f14] text-white">
            <Sidebar />

            <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                {renderContent()}
            </main>
        </div>
    );
};

export default Admin;
