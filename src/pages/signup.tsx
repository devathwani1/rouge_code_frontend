import React from "react";
import logo from "../assets/logo.svg";
import illustration from "../assets/avatar_reg.svg";

const Signup: React.FC = () => {
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

        <form className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign up
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
          Don’t have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
