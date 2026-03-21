import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { usePasswordResetRequestMutation } from "../store/api/authApi";

const Forget: React.FC = () => {
  const [email, setEmail] = useState("");
  const [requestReset, { isLoading }] = usePasswordResetRequestMutation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      const res = await requestReset({ email: trimmed }).unwrap();
      setSubmitted(true);
      toast.success(res.message || "Check your inbox for reset instructions.");
    } catch (err: unknown) {
      const d = err as { data?: { message?: string; error?: string[] } };
      const msg =
        d.data?.message ||
        d.data?.error?.join(" ") ||
        "Something went wrong. Try again later.";
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#0b0f14] text-white items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl md:text-[46px] py-6 font-bold">Forgot your password?</h1>

        <p className="text-blue-500 text-lg">
          Enter your email below. If an account exists, we&apos;ll send a{" "}
          <span className="text-white">reset link</span> (valid for a limited time).
        </p>

        {submitted ? (
          <div className="mt-8 p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-left">
            <p className="text-emerald-300 font-medium">
              If an account exists for that email, password reset instructions have been sent.
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Check your spam folder. You can request another link below if needed.
            </p>
          </div>
        ) : null}

        <form className="space-y-5 mt-8 max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition block disabled:opacity-50"
          >
            {isLoading ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <p className="text-gray-400 mt-8 text-sm">
          Remember your password?{" "}
          <Link to="/signin" className="text-blue-500 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Forget;
