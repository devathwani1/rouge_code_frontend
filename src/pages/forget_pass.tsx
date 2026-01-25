import React from "react";
const Forget: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0b0f14] text-white items-center justify-center">
      <div className="w-full text-center ">
        <h1 className="text-[46px] py-10 font-bold">
          Forgot your password?
        </h1>

        <p className="text-blue-500 text-lg">
          Enter your email below, we will send a {" "}
          <span className="text-white ">
            reset password
          </span> link on it
        </p>

        <form className="space-y-5 mt-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-transparent max-w-md border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full max-w-md mx-auto bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition block"
          >
            Send reset link
          </button>
        </form>

        <p className="text-gray-400 mt-6">
          Didn’t receive the email?{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            Check spam or try again
          </span>
        </p>

        <a
          href="/signin"
          className="block mt-6 text-white hover:underline"
        >
          Back to login
        </a>
      </div>
    </div>
  );
};

export default Forget;
