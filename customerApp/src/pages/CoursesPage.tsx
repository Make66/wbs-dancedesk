import { useEffect, useState } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import WeeklySchedule from "../components/plan/WeeklySchedule";
import { getISOWeek, startOfWeek, addWeeks } from "date-fns";

const CoursesPage = () => {
  const today = new Date();
  const [weekDate, setWeekDate] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [weekData, setWeekData] = useState(null);

  const startOfW = startOfWeek(weekDate, { weekStartsOn: 1 });
  const currentWeek = getISOWeek(weekDate);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/courses/week/${currentWeek}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );
        const data = await response.json();
        console.log("Week data:", data);
        setWeekData(data);
      } catch (error) {
        console.error("Error fetching week data:", error);
      }
    };
    fetchData();
  }, [currentWeek]);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-900 sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">Kursplan</h1>
          <div className="ml-5 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer"
                onClick={() => setWeekDate((prev) => addWeeks(prev, -1))}
              >
                <GrPrevious className="text-gray-500" />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">{currentWeek} KW</span>
              <button
                className="cursor-pointer"
                onClick={() => setWeekDate((prev) => addWeeks(prev, 1))}
              >
                <GrNext className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 mt-3">
        <WeeklySchedule data={weekData} startDate={startOfW} />
      </div>
    </div>
  );
};

export default CoursesPage;
