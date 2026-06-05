import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProfileStatsQuery } from "../store/api/profileApi";

const SKIP_REDIRECT_PREFIXES = ["/admin"];

/** If the user is out of lives, force the game-over flow (except auth/public routes). */
const LivesZeroRedirect: React.FC = () => {
  const token = localStorage.getItem("token");
  const loc = useLocation();
  const navigate = useNavigate();
  const { data: stats, isFetching } = useGetProfileStatsQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!token || !stats || isFetching) return;
    if (stats.lives !== 0) return;
    if (loc.pathname === "/game-over") return;

    const p = loc.pathname;
    if (
      p === "/signin" ||
      p === "/signup" ||
      p === "/forget_pass" ||
      p === "/new_pass" ||
      p === "/verifyEmail"
    ) {
      return;
    }
    if (SKIP_REDIRECT_PREFIXES.some((prefix) => p.startsWith(prefix))) {
      return;
    }

    navigate("/game-over", { replace: true });
  }, [token, stats, isFetching, loc.pathname, navigate]);

  return null;
};

export default LivesZeroRedirect;
