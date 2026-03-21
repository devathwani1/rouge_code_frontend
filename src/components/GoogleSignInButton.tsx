import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGoogleAuthMutation } from "../store/api/authApi";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export type GoogleSignInVariant = "signin" | "signup";

interface GoogleSignInButtonProps {
  variant?: GoogleSignInVariant;
}

/**
 * Renders Google Identity Services button; exchanges ID token with backend for JWT.
 * Requires VITE_GOOGLE_CLIENT_ID and wrapping app in GoogleOAuthProvider (see main.tsx).
 */
const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ variant = "signin" }) => {
  const navigate = useNavigate();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();

  if (!CLIENT_ID?.trim()) {
    return (
      <p className="text-center text-xs text-amber-500/90 px-2">
        Google sign-in is disabled: add{" "}
        <code className="text-amber-400">VITE_GOOGLE_CLIENT_ID</code> to{" "}
        <code className="text-amber-400">.env</code> and restart Vite.
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div
        className={`w-full flex justify-center min-h-[44px] items-center ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <GoogleLogin
          text={variant === "signup" ? "signup_with" : "signin_with"}
          shape="rectangular"
          size="large"
          width={384}
          theme="filled_black"
          onSuccess={async (cred) => {
            const token = cred.credential;
            if (!token) {
              toast.error("Google did not return a credential.");
              return;
            }
            try {
              const result = await googleAuth({ credential: token }).unwrap();
              if (result.success && result.data?.token) {
                localStorage.setItem("token", result.data.token);
                toast.success(result.message || "Signed in with Google!");
                navigate("/introduction");
              } else {
                toast.error(result.message || "Google sign-in failed.");
              }
            } catch (err: unknown) {
              const d = err as {
                data?: { message?: string; detail?: unknown; error?: string };
                error?: string;
              };
              const msg =
                (typeof d.data === "object" && d.data && "message" in d.data ? d.data.message : undefined) ||
                (typeof d.data === "string" ? d.data : undefined) ||
                (typeof d.data === "object" && d.data && "detail" in d.data && typeof d.data.detail === "string"
                  ? d.data.detail
                  : undefined) ||
                d.error ||
                "Google sign-in failed (network or server error).";
              toast.error(String(msg));
            }
          }}
          onError={() => {
            toast.error("Google sign-in was cancelled or failed.");
          }}
        />
      </div>
    </div>
  );
};

export default GoogleSignInButton;
