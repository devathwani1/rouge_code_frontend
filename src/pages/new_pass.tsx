import React from "react";
const Newpass: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0b0f14] text-white items-center justify-center">
      <div className="w-full text-center ">
        <h1 className="text-[46px] py-10 font-bold">
          Create a new password
        </h1>

        <p className="text-blue-500 text-lg">
          Your {" "}
          <span className="text-white ">
            new password must be different
          </span> from your current password.
        </p>

        <form className="space-y-5 mt-6">
          <input
            type="password"
            placeholder="New Password"
            className="w-full bg-transparent max-w-md border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
          />
        <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-transparent max-w-md mx-auto border-2 border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition block"
          />
          <button
            type="submit"
            className="w-full max-w-md mx-auto bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition block"
          >
            Reset Password
          </button>
        </form>

        <p className="text-gray-400 mt-6">
          This link will{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            expire in 15 minutes
          </span> for security reasons.
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

export default Newpass;
