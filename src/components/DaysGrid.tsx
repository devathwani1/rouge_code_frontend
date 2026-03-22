import { useNavigate } from "react-router-dom";
import DayCard from "./DayCard";
import type { DailyPlan, DayPlanStatus } from "../store/api/types";

interface Props {
  dailyPlans: DailyPlan[];
}

function normalizeStatus(raw: string | undefined): DayPlanStatus {
  const s = (raw || "").toLowerCase();
  if (s === "success") return "Success";
  if (s === "failed") return "Failed";
  if (s === "current") return "Current";
  if (s === "upcoming") return "Upcoming";
  return "Upcoming";
}

const DaysGrid: React.FC<Props> = ({ dailyPlans }) => {
  const navigate = useNavigate();

  if (!dailyPlans || dailyPlans.length === 0) {
    return <div className="text-white">No levels found</div>;
  }

  return (
    <div className="relative z-[1] w-full min-w-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8 justify-items-center">
      {dailyPlans.map((plan) => {
        const day = plan.day_number;
        const status = normalizeStatus(plan.status);

        return (
          <DayCard
            key={plan.id}
            day={day}
            status={status}
            onClick={() => navigate(`/daily-plan/${plan.id}`)}
          />
        );
      })}
    </div>
  );
};

export default DaysGrid;
