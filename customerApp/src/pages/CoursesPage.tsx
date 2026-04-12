import { useEffect, useState, type ComponentProps } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import WeeklySchedule from "../components/plan/WeeklySchedule";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { getCoursesByWeekDB } from "../data/course";
import { toast } from "react-toastify";

const CoursesPage = () => {
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getISOWeek(today));
  const [currentYear] = useState(getISOWeekYear(today));
  const [weekData, setWeekData] =
    useState<ComponentProps<typeof WeeklySchedule>["data"]>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCoursesByWeekDB(currentYear, currentWeek);
        setWeekData(data);
      } catch (error) {
        console.error("Error fetching week data:", error);
        toast.error("Fehler beim Abrufen der Kursdaten für die Woche. Bitte versuche es erneut.");
      }
    };
    fetchData();
  }, [currentWeek, currentYear]);

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="bg-background sticky top-0 flex h-20 items-center gap-9 border-b border-muted-foreground pl-6 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">Kursplan</h1>
          <div className="ml-5 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer"
                onClick={() => setCurrentWeek((prev) => (prev > 1 ? prev - 1 : prev))}
              >
                <GrPrevious className="text-gray-500" />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">{currentWeek} KW</span>
              <button className="cursor-pointer" onClick={() => setCurrentWeek((prev) => prev + 1)}>
                <GrNext className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 mt-1">
        <WeeklySchedule data={weekData} week={currentWeek} year={currentYear} />
      </div>
    </div>
  );
};

export default CoursesPage;
