import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import illustration from "../assets/avatar_reg.svg";
import { useRegisterMutation } from "../store/api/authApi";
import { ActionRequired } from "../store/api/types";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (formData.password !== formData.confirm_password) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const result = await register(formData).unwrap();
      if (result.success || result.action_required === ActionRequired.VERIFY_EMAIL) {
        setSuccessMsg(result.message || "Registration successful! Please verify your email.");
        setTimeout(() => {
          navigate("/verifyEmail");
        }, 2000);
      } else if (result.action_required === ActionRequired.LOGIN) {
        setErrorMsg(result.message || "Already registered. Please login.");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.data?.message || err.data?.detail || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0f14] text-white">
      {/* LEFT PANEL */}
      <div className="flex-[2] bg-black flex flex-col gap-15 items-center justify-center">
        {/* Logo + Title */}
        <div className="text-center">
          <img src={logo} alt="Rogue Code Logo" className="w-[260px] mx-auto" />
          <h1 className="mt-2 text-[46px] font-bold">ROGUECODE</h1>
        </div>

        <div className="relative mt-32">
          {/* Bubble */}
          <div className="bg-gray-200 text-black font-semibold px-8 py-4 rounded-md ml-28">
            Create your identity. Enter the arena.
          </div>

          {/* Avatar */}
          <img
            src={illustration}
            alt="Gaming Illustration"
            className="absolute -left-20 -bottom-[110px] w-[260px] z-10"
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 px-20 flex flex-col justify-center">
        <h2 className="text-[46px] mb-10 font-semibold">Sign up</h2>

        {errorMsg && <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-xl">{errorMsg}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-xl">{successMsg}</div>}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={formData.confirm_password}
            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4 text-gray-400">
          <span className="flex-1 h-px bg-gray-600" />
          OR
          <span className="flex-1 h-px bg-gray-600" />
        </div>

        {/* Google Button */}
        <button className="w-full border-2 border-blue-500 text-blue-500 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white transition">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5"
          />
          Register with Google
        </button>

        {/* Sign in link */}
        <p className="mt-8 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
