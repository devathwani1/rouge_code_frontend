import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useGetProfileQuery } from "../store/api/profileApi";

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem("token");
  const isAuthed = !!token;
  const { data: profile } = useGetProfileQuery(undefined as void, {
    skip: !token,
  });

  // Match profile page: headline is username || email, subtitle is email.
  const displayName = (profile?.username || profile?.email || "").trim();
  const email = (profile?.email ?? "").trim();
  const initial = useMemo(() => {
    const base = displayName || email;
    return base ? base[0].toUpperCase() : "U";
  }, [displayName, email]);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e: MouseEvent) => {
      const el = dropdownRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    return () => window.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    navigate("/signin");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 p-3 px-6 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={logo} alt="RogueCode" className="w-10 brightness-110 drop-shadow-glow" />
        {isAuthed && (
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-gray-400">
            <Link to="/levels" className="hover:text-white transition-colors">
              Levels
            </Link>
            <Link to="/profile" className="hover:text-white transition-colors">
              Profile
            </Link>
          </nav>
        )}
      </div>

      {isAuthed && (
        <div className="flex items-center gap-4" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 shadow-lg flex items-center justify-center select-none"
            aria-label="User menu"
          >
            <span className="text-xs font-bold text-white">{initial}</span>
          </button>

          {open && (
            <div className="absolute right-6 top-16 w-60 mt-2 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 text-sm text-gray-300 truncate">
                <div className="font-medium text-white">{displayName || "User"}</div>
                {email && displayName !== email && (
                  <div className="text-xs text-white/50 mt-0.5 truncate">{email}</div>
                )}
                {!email && !displayName && <span className="text-white/50">user@unknown</span>}
              </div>
              <div className="p-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TopBar;

