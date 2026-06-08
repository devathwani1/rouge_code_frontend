import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.svg";
import illustration from "../assets/avatar_reg.svg";
import { useRegisterMutation } from "../store/api/authApi";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { ActionRequired } from "../store/api/types";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    age: "",
    password: "",
    confirm_password: "",
  });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/introduction");
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    const age = Number(formData.age);
    if (!Number.isInteger(age) || age < 18) {
      toast.error("You must be at least 18 years old to sign up.");
      return;
    }

    try {
      const result = await register({ ...formData, age }).unwrap();
      if (result.success || result.action_required === ActionRequired.VERIFY_EMAIL) {
        toast.success(result.message || "Registration successful! Please verify your email.");
        setTimeout(() => {
          navigate("/verifyEmail");
        }, 2000);
      } else {
        toast.error(result.message || "Registration failed");

        if (result.action_required === ActionRequired.LOGIN) {
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        }
      }
    } catch (err: any) {
      const ageError = Array.isArray(err.data?.age) ? err.data.age[0] : undefined;
      toast.error(err.data?.message || err.data?.detail || ageError || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#0b0f14] text-white">
      <div className="flex-[2] bg-black flex flex-col gap-15 items-center justify-center">
        <div className="text-center">
          <img src={logo} alt="Rogue Code Logo" className="w-[260px] mx-auto" />
          <h1 className="mt-2 text-[46px] font-bold">ROGUECODE</h1>
        </div>

        <div className="relative mt-32">
          <div className="bg-gray-200 text-black font-semibold px-8 py-4 rounded-md ml-28">
            Create your identity. Enter the arena.
          </div>

          <img
            src={illustration}
            alt="Gaming Illustration"
            className="absolute -left-20 -bottom-[110px] w-[260px] z-10"
          />
        </div>
      </div>

      <div className="flex-1 px-20 flex flex-col justify-center">
        <h2 className="text-[46px] mb-10 font-semibold">Sign up</h2>

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
            type="number"
            placeholder="Age"
            required
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
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

        <div className="my-8 flex items-center gap-4 text-gray-400">
          <span className="flex-1 h-px bg-gray-600" />
          OR
          <span className="flex-1 h-px bg-gray-600" />
        </div>

        <GoogleSignInButton variant="signup" />

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
