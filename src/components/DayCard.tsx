import { Lock } from "lucide-react";
import type { DayPlanStatus } from "../store/api/types";

interface Props {
  day: number;
  status: DayPlanStatus;
  onClick: () => void;
}

const statusStyles: Record<
  DayPlanStatus,
  { card: string; text: string; sub: string }
> = {
  Current: {
    card: "bg-gradient-to-br from-cyan-400 to-blue-500 hover:scale-105 cursor-pointer shadow-[0_0_24px_rgba(59,130,246,0.35)]",
    text: "text-slate-900",
    sub: "text-slate-800/90",
  },
  Upcoming: {
    card: "bg-gray-600/40 border border-white/10 cursor-not-allowed",
    text: "text-gray-400",
    sub: "text-gray-500",
  },
  Failed: {
    card: "bg-gradient-to-br from-red-600 to-rose-700 hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(225,29,72,0.35)]",
    text: "text-white",
    sub: "text-red-100",
  },
  Success: {
    card: "bg-gradient-to-br from-emerald-500 to-green-600 hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.35)]",
    text: "text-white",
    sub: "text-emerald-100",
  },
};

const DayCard: React.FC<Props> = ({ day, status, onClick }) => {
  const isLocked = status === "Upcoming";
  const styles = statusStyles[status] ?? statusStyles.Upcoming;

  return (
    <div
      onClick={isLocked ? undefined : onClick}
      className={`w-48 h-48 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${styles.card}`}
    >
      {isLocked ? (
        <Lock className="text-gray-500" size={45} />
      ) : (
        <>
          <h2 className={`text-4xl font-bold ${styles.text}`}>{day}</h2>
          <p className={`text-lg font-medium ${styles.sub}`}>Day</p>
        </>
      )}
    </div>
  );
};

export default DayCard;
