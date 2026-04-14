import { useEffect, useState, useMemo, type ComponentProps } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import WeeklySchedule from "../components/plan/WeeklySchedule";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { getCoursesByWeekDB } from "../data/course";
import { toast } from "react-toastify";
import { userStore } from "../stores/userStore";
import { targetStore } from "../stores/targetStore";

const CoursesPage = () => {
  const today = new Date();
  const user = userStore((state) => state.user);
  const setSelectedLocationId = userStore((state) => state.setSelectedLocationId);
  const [currentWeek, setCurrentWeek] = useState(getISOWeek(today));
  const [currentYear] = useState(getISOWeekYear(today));
  const [weekData, setWeekData] =
    useState<ComponentProps<typeof WeeklySchedule>["data"]>(undefined);

  const [filterLocationId, setFilterLocationId] = useState<string | null>(
    userStore.getState().selectedLocationId,
  );
  const [filterTargetId, setFilterTargetId] = useState<string | null>(null);

  const locations = useMemo(() => {
    if (!user) return [];
    return user.locations.filter((l) => !l.isDeleted && l.isActive);
  }, [user]);

  const storeTargets = targetStore((state) => state.targets);
  const visibleTargets = useMemo(
    () => storeTargets.filter((t) => !t.isDeleted && t.isActive),
    [storeTargets],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCoursesByWeekDB(currentYear, currentWeek, {
          locationId: filterLocationId ?? undefined,
          targetId: filterTargetId ?? undefined,
        });
        setWeekData(data);
      } catch (error) {
        console.error("Error fetching week data:", error);
        toast.error("Fehler beim Abrufen der Kursdaten für die Woche. Bitte versuche es erneut.");
      }
    };
    fetchData();
  }, [currentWeek, currentYear, filterLocationId, filterTargetId]);

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="bg-background sticky top-0 flex h-20 items-center gap-6 border-b border-muted-foreground pl-6 pr-6 z-20">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold">Kursplan</h1>
          <div className="ml-5 flex items-center gap-1">
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

          <div className="flex items-center gap-3 ml-auto">
            {locations.length > 1 && (
              <select
                value={filterLocationId ?? ""}
                onChange={(e) => {
                  const val = e.target.value || null;
                  setFilterLocationId(val);
                  setFilterTargetId(null);
                  if (val) setSelectedLocationId(val);
                }}
                className="rounded-lg border border-muted-foreground bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">Alle Standorte</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}

            {visibleTargets.length > 0 && (
              <select
                value={filterTargetId ?? ""}
                onChange={(e) => setFilterTargetId(e.target.value || null)}
                className="rounded-lg border border-muted-foreground bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">Alle Zielgruppen</option>
                {visibleTargets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
              </select>
            )}
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
