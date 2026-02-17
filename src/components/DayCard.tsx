import { Lock } from "lucide-react";

interface Props {
  day: number;
  isUnlocked: boolean;
  onClick: () => void;
}

const DayCard: React.FC<Props> = ({
  day,
  isUnlocked,
  onClick,
}) => {
  return (
    <div
      onClick={isUnlocked ? onClick : undefined}
      className={`w-48 h-48 rounded-2xl flex flex-col items-center justify-center
      transition-all duration-300
      ${
        isUnlocked
          ? "bg-gradient-to-br from-cyan-400 to-blue-400 hover:scale-105 cursor-pointer"
          : "bg-gray-300 cursor-not-allowed"
      }`}
    >
      {isUnlocked ? (
        <>
          <h2 className="text-4xl font-bold">{day}</h2>
          <p className="text-lg">Day</p>
        </>
      ) : (
        <Lock size={45} />
      )}
    </div>
  );
};

export default DayCard;
