import React from "react";
import logo from "../assets/logo.svg"
const Activation: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0b0f14] text-white items-center justify-center">
      <header className="p-2 bg-[#282828]" >
        <img src={logo} alt="RogueCode" className="w-14" />
      </header>
      <div className="w-full text-center ">
        <h1 className="text-[46px] font-bold">
          Check Your Inbox
        </h1>

        <p className="text-blue-500 text-lg placeholder-gray-600">
          We've sent a {" "}
          <span className="text-white ">
            verification link
          </span> to your email address.
        </p>

        <p className="text-blue-500 text-lg">
          Please{" "}
          <span className="text-white ">
            click the link
          </span> to verify your account and continue.
        </p>

        <p className="text-blue-500 text-lg">
          Sent to:{" "}
          <span className="text-white ">
            {" "}
          </span> 
        </p>

        <form className="space-y-5 mt-6">
          
          <button
            type="submit"
            className="w-full max-w-md mx-auto bg-blue-600 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition block"
          >
            Resend Activation Link
          </button>
        </form>

        <p className="text-blue-500 text-lg py-6">
          Resend again in{" "}
          <span className="text-white ">
            {" "} 
          </span> seconds.
        </p>

        <p className="text-white text-lg">
          
            Didn't recieve the email?
          
        </p>
        <p className="text-blue-500 text-lg">
        Check your spam or promotions folder, or request a new link.
        </p>
        
      </div>
    </div>
  );
};

export default Activation;
