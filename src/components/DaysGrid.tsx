import { useNavigate } from "react-router-dom";
import DayCard from "./DayCard";
import type { DailyPlan } from "../store/api/types";

interface Props {
  dailyPlans: DailyPlan[];
  completedDays: number;
}

const DaysGrid: React.FC<Props> = ({
  dailyPlans,
  completedDays,
}) => {
  const navigate = useNavigate();

  if (!dailyPlans || dailyPlans.length === 0) {
    return <div className="text-white">No levels found</div>;
  }

  return (
    <div className="grid grid-cols-6 gap-16">
      {dailyPlans.map((plan) => {
        const day = plan.day_number;
        const isUnlocked = day <= completedDays + 1;

        return (
          <DayCard
            key={plan.id}
            day={day}
            isUnlocked={isUnlocked}
            onClick={() =>
              navigate(`/daily-plan/${plan.id}`)
            }
          />
        );
      })}
    </div>
  );
};

export default DaysGrid;
