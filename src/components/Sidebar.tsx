import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

const Sidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Questions", path: "/admin/questions" },
        { name: "Users", path: "/admin/users" },
        { name: "Submissions", path: "/admin/submissions" },
    ];

    return (
        <div className="w-64 h-[calc(100vh-4rem)] bg-black border-r border-blue-900/30 flex flex-col p-6 sticky top-16">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
                <img src={logo} alt="RogueCode" className="w-10" />
                <span className="text-xl font-bold tracking-tighter">ROGUECODE</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive =
                        item.path === "/admin/questions"
                            ? location.pathname === item.path ||
                              location.pathname.startsWith("/admin/questions/edit/")
                            : location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-blue-600/20 border border-blue-500 text-blue-400"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto pt-6 border-t border-gray-800">
                <Link
                    to="/signin"
                    className="flex items-center px-4 py-3 rounded-xl text-gray-500 hover:text-red-400 transition-colors"
                >
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
