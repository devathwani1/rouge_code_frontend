import React from "react";
import "../styles/signup.css";
import logo from "../assets/logo.svg";
import illustration from "../assets/avatar_reg.svg";

const Signup: React.FC = () => {
  return (
    <div className="signup-container">
      
      <div className="signup-left">
        <div className="logo-section">
          <img src={logo} alt="Rogue Code Logo" />
          <h1>ROGUECODE</h1>
        </div>
        <div className="avatar-row">
          <img
          src={illustration}
          alt="Gaming Illustration"
          className="illustration"
          />
          <div className="tagline-box">
            Create your identity. Enter the arena.
          </div>
        </div>
      
      </div>

      <div className="signup-right">
        <h2>Sign up</h2>

        <form className="signup-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />

          <button type="submit" className="signup-btn">
            Sign up
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="google-btn">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
          />
          Register with Google
        </button>

        <p className="signin-text">
          Already have an account? <span>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
