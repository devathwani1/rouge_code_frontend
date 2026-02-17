import { useNavigate } from "react-router-dom";
import DayCard from "./DayCard";

interface Props {
  difficulty: string;
  totalDays: number;
  completedDays: number;
}

const DaysGrid: React.FC<Props> = ({
  difficulty,
  totalDays,
  completedDays,
}) => {
  const navigate = useNavigate();

  if (!totalDays || totalDays <= 0) {
    return <div className="text-white">No levels found</div>;
  }

  return (
    <div className="grid grid-cols-6 gap-16">
      {Array.from({ length: totalDays }, (_, i) => {
        const day = i + 1;
        const isUnlocked = day <= completedDays + 1;

        return (
          <DayCard
            key={day}
            day={day}
            isUnlocked={isUnlocked}
            onClick={() =>
              navigate(`/levels/${difficulty}/day/${day}`)
            }
          />
        );
      })}
    </div>
  );
};

export default DaysGrid;
