import { WeekCalendar } from "../components/calendar/WeekCalendar";

const CoursesPage = () => {
  return (
    <div className="w-full h-screen bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-900 sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 pl-6 z-20">
        <h1 className="text-3xl font-semibold">Kursplan</h1>
      </div>
      <div className="p-6 mt-3">
        <WeekCalendar />
      </div>
    </div>
  );
};

export default CoursesPage;
