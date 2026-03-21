import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useVerifyEmailQuery } from "../store/api/authApi";

const Activation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { data, isLoading, isError, error } = useVerifyEmailQuery(token!, {
    skip: !token,
  });

  if (token) {
    return (
      <div className="flex h-screen bg-[#0b0f14] text-white items-center justify-center">
        <div className="w-full text-center max-w-xl px-6">
          {isLoading && (
            <h1 className="text-[46px] font-bold animate-pulse">Verifying...</h1>
          )}

          {data?.success && (
            <>
              <h1 className="text-[46px] font-bold text-green-500 mb-4">Verification Successful!</h1>
              <p className="text-lg text-gray-300 mb-8">
                Your email has been verified. You can now sign in to your account.
              </p>
              <Link
                to="/signin"
                className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition block"
              >
                Go to Sign in
              </Link>
            </>
          )}

          {(isError || (data && !data.success)) && (
            <>
              <h1 className="text-[46px] font-bold text-red-500 mb-4">Verification Failed</h1>
              <p className="text-lg text-gray-300 mb-8">
                {data?.message || (error as any)?.data?.message || "The verification link is invalid or has expired."}
              </p>
              <Link
                to="/signup"
                className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition block"
              >
                Back to Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b0f14] text-white items-center justify-center">
      <div className="w-full text-center max-w-xl px-6">
        <h1 className="text-[46px] font-bold mb-6">Check Your Inbox</h1>

        <p className="text-blue-500 text-lg mb-2">
          We've sent a <span className="text-white">verification link</span> to your email address.
        </p>

        <p className="text-blue-500 text-lg mb-8">
          Please <span className="text-white">click the link</span> in that email to verify your account and continue.
        </p>

        <form className="space-y-5 mt-6" onSubmit={(e) => e.preventDefault()}>
          <button
            type="submit"
            className="w-full bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition block"
          >
            Resend Activation Link
          </button>
        </form>

        <p className="text-white text-lg mt-10">Didn't receive the email?</p>
        <p className="text-blue-500 text-lg">
          Check your spam or promotions folder, or request a new link.
        </p>
      </div>
    </div>
  );
};

export default Activation;
