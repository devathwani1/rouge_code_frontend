import React from "react";
import {Link} from "react-router-dom";
import logo from "../assets/logo.svg";
import illustration from "../assets/avatar_reg.svg";

const Signup: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0b0f14] text-white ">
      
      <div className="flex-[2] bg-black flex flex-xol px-16 py-12 item-center justify-center">
        <div className="text-center gap-4">
          <img src={logo} alt="Rogue Code Logo" className="w-[260px] mx-auto" />
          <h1 className="mt-20  text-[46px] tracking-widest items-center">ROGUECODE</h1>
        </div>
        <div className="flex items-center mt-80 translate-x-2 ">
          <img
          src={illustration}
          alt="Gaming Illustration"
          className="w-[280px]"
          />
          <div className="relative bg-gray-200 text-black font-semibold px-6 py-4 rounded-md ml-2 translate-y-6 translate-x-6">
            Create your identity. Enter the arena.
          </div>
        </div>
      </div>

      <div className="flex-1 px-20 flex flex-col justify-center">
        <h2 className="text-[46px] mb-10">Sign up</h2>

        {/* Form */}
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
            className="w-full bg-blue-600 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
          >
            Sign up
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 text-center text-gray-400">OR</div>

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
