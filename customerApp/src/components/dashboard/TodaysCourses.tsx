type Course = {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  instructor: string;
  room: string;
  color: string;
  seats: number;
  maxSeats: number;
};

const DUMMY_COURSES: Course[] = [
  { id: 1, name: "Salsa Basis", startTime: "10:00", endTime: "11:30", instructor: "Maria Lopez", room: "Saal 1", color: "#f97316", seats: 12, maxSeats: 16 },
  { id: 2, name: "Tango Fortgeschritten", startTime: "12:00", endTime: "13:30", instructor: "Carlos Ruiz", room: "Saal 2", color: "#8b5cf6", seats: 8, maxSeats: 10 },
  { id: 3, name: "Bachata Anfänger", startTime: "15:00", endTime: "16:30", instructor: "Anna Müller", room: "Saal 1", color: "#ec4899", seats: 14, maxSeats: 20 },
  { id: 4, name: "Discofox Paare", startTime: "18:00", endTime: "19:30", instructor: "Peter Schmidt", room: "Saal 3", color: "#06b6d4", seats: 10, maxSeats: 12 },
];

const TodaysCourses = () => {
  const now = new Date();
  const today = now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Heutige Kurse</h2>
        <span className="text-sm text-muted-foreground">{today}</span>
      </div>

      <div className="space-y-2">
        {DUMMY_COURSES.map((course) => {
          const occupancy = Math.round((course.seats / course.maxSeats) * 100);
          const isAlmostFull = occupancy >= 80;

          return (
            <div
              key={course.id}
              className="flex items-center gap-3 rounded-lg p-3 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <div
                className="w-1.5 self-stretch rounded-full shrink-0"
                style={{ backgroundColor: course.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{course.name}</p>
                <p className="text-xs text-muted-foreground">{course.instructor} · {course.room}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium tabular-nums">{course.startTime} – {course.endTime}</p>
                <p className={`text-xs ${isAlmostFull ? "text-red-500" : "text-green-500"}`}>
                  {course.seats}/{course.maxSeats} Plätze
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodaysCourses;
