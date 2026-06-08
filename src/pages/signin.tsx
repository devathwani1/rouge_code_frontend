import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo.svg";
import illustration from "../assets/avatar_reg.svg";
import { useLoginMutation } from "../store/api/authApi";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { ActionRequired } from "../store/api/types";

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    temporaryLogin: false,
  });
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/introduction");
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Read from refs to avoid any edge cases where React state is briefly out of sync
      // (e.g., autofill or very fast clicking).
      const email = emailRef.current?.value ?? formData.email;
      const password = passwordRef.current?.value ?? formData.password;
      const result = await login({
        email,
        password,
        temporary_login: formData.temporaryLogin,
      }).unwrap();
      if (result.success) {
        localStorage.setItem("token", result.data.token);
        toast.success(result.message || "Logged in successfully!");
        navigate("/introduction");
      } else {
        toast.error(result.message || "Login failed");

        if (result.action_required === ActionRequired.VERIFY_EMAIL) {
          setTimeout(() => {
            navigate("/verifyEmail");
          }, 2000);
        }
      }
    } catch (err: unknown) {
      const errorData =
        typeof err === "object" && err !== null && "data" in err
          ? (err as { data?: { message?: unknown; detail?: unknown } }).data
          : undefined;
      const errorMessage =
        typeof errorData?.message === "string"
          ? errorData.message
          : typeof errorData?.detail === "string"
            ? errorData.detail
            : "Login failed. Please check your credentials.";

      toast.error(errorMessage);
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
            Welcome,
            to the Battleground of programmers!
          </div>

          <img
            src={illustration}
            alt="Gaming Illustration"
            className="absolute -left-20 -bottom-[110px] w-[260px] z-10"
          />
        </div>
      </div>

      <div className="flex-1 px-20 flex flex-col justify-center">
        <h2 className="text-[46px] mb-10 font-semibold">Sign in</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Login Baby"
            required
            value={formData.email}
            ref={emailRef}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            ref={passwordRef}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="flex items-start gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={formData.temporaryLogin}
              onChange={(e) =>
                setFormData({ ...formData, temporaryLogin: e.target.checked })
              }
              className="mt-1 h-4 w-4 rounded border-blue-500 bg-transparent text-blue-600 focus:ring-blue-400"
            />
            <span>
              <span className="font-medium text-white">Temporary login</span>
              <span className="block text-xs text-gray-400">
                Use a 10-minute session token for this sign in.
              </span>
            </span>
          </label>

          <Link to="/forget_pass" className="text-blue-500 hover:underline text-right transition block">
            Forget Password
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 text-gray-400">
          <span className="flex-1 h-px bg-gray-600" />
          OR
          <span className="flex-1 h-px bg-gray-600" />
        </div>

        <GoogleSignInButton
          variant="signin"
          temporaryLogin={formData.temporaryLogin}
        />

        <p className="mt-8 text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
