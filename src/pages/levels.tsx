import { useParams } from "react-router-dom";
import { useGetProgressQuery } from "../store/api/challengesApi";
import DaysGrid from "../components/DaysGrid";

const LevelsPage = () => {
  const { difficulty } = useParams<{ difficulty: string }>();

  const { data, isLoading, isError } =
    useGetProgressQuery(difficulty!);

  console.log("LevelsPage Debug:", { difficulty, data, isLoading, isError });

  if (isLoading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (isError || !data)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-red-500">
        Error loading levels
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-12 text-white">
      <DaysGrid
  difficulty={difficulty!}
  totalDays={data.total_days}
  completedDays={data.completed_days}
/>

    </div>
  );
};

export default LevelsPage;
