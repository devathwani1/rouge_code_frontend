import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { usePasswordResetConfirmMutation } from "../store/api/authApi";

const Newpass: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmReset, { isLoading }] = usePasswordResetConfirmMutation();

  const linkValid = useMemo(() => Boolean(uid && token), [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkValid) {
      toast.error("Invalid or missing reset link. Request a new one from the sign-in page.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const res = await confirmReset({
        uid,
        token,
        new_password: password,
        confirm_password: confirm,
      }).unwrap();
      toast.success(res.message || "Password updated. You can sign in now.");
      navigate("/signin", { replace: true });
    } catch (err: unknown) {
      const d = err as {
        data?: { message?: string; error?: string[] };
      };
      const msg =
        d.data?.message ||
        d.data?.error?.join(" ") ||
        "Could not reset password. The link may have expired.";
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#0b0f14] text-white items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl md:text-[46px] py-6 font-bold">Create a new password</h1>

        <p className="text-blue-500 text-lg">
          Your{" "}
          <span className="text-white">new password must meet strength requirements</span> and
          should differ from old passwords you no longer use.
        </p>

        {!linkValid && (
          <div className="mt-8 p-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-left">
            <p className="text-amber-200 font-medium">This page needs a valid reset link.</p>
            <p className="text-gray-400 text-sm mt-2">
              Open the link from your email, or request a new reset from sign in.
            </p>
            <Link
              to="/forget_pass"
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-semibold"
            >
              Request reset link →
            </Link>
          </div>
        )}

        <form className="space-y-5 mt-8 max-w-md mx-auto" onSubmit={handleSubmit}>
          <input
            type="password"
            name="new-password"
            autoComplete="new-password"
            placeholder="New password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || !linkValid}
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
          <input
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            placeholder="Confirm password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={isLoading || !linkValid}
            className="w-full bg-transparent border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !linkValid}
            className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition block disabled:opacity-50"
          >
            {isLoading ? "Saving…" : "Reset password"}
          </button>
        </form>

        <p className="text-gray-400 mt-8 text-sm">
          Reset links expire for security. If yours expired,{" "}
          <Link to="/forget_pass" className="text-blue-500 hover:underline">
            request a new one
          </Link>
          .
        </p>

        <Link to="/signin" className="block mt-6 text-white hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default Newpass;
