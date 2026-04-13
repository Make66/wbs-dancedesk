import GenderChart from "../charts/GenderChart";
import SeatingChart from "../charts/SeatingChart";
import WeekdayChart from "./WeekdayChart";
import EnrollmentTrendChart from "./EnrollmentTrendChart";

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Reihe 1 */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <h2 className="text-base font-semibold mb-1">Geschlechterverteilung</h2>
        <p className="text-xs text-muted-foreground mb-2">Alle Teilnehmer</p>
        <GenderChart male={54} female={89} other={7} />
        <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2b7fff] inline-block" /> Männlich
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f6339a] inline-block" /> Weiblich
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7ccf00] inline-block" /> Divers
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <h2 className="text-base font-semibold mb-1">Gesamtauslastung</h2>
        <p className="text-xs text-muted-foreground mb-2">Alle aktiven Kurse</p>
        <SeatingChart seatsCurrent={134} maxSeats={172} />
        <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block" /> Belegt (134)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] inline-block" /> Frei (38)
          </span>
        </div>
      </div>

      {/* Reihe 2 */}
      <WeekdayChart />
      <EnrollmentTrendChart />
    </div>
  );
};

export default DashboardCharts;
