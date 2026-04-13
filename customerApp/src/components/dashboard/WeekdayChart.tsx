import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const DUMMY_DATA = [
  { day: "Mo", courses: 5 },
  { day: "Di", courses: 3 },
  { day: "Mi", courses: 7 },
  { day: "Do", courses: 4 },
  { day: "Fr", courses: 6 },
  { day: "Sa", courses: 9 },
  { day: "So", courses: 2 },
];

const BAR_COLOR = "#2b7fff";
const TODAY_COLOR = "#f97316";

const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const WeekdayChart = () => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h2 className="text-base font-semibold mb-1">Kurse pro Wochentag</h2>
      <p className="text-xs text-muted-foreground mb-4">Aktuelle Woche · heute hervorgehoben</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={DUMMY_DATA} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow">
                  <p className="font-semibold">{label}</p>
                  <p className="text-muted-foreground">{payload[0].value} Kurse</p>
                </div>
              );
            }}
          />
          <Bar dataKey="courses" radius={[6, 6, 0, 0]}>
            {DUMMY_DATA.map((_, index) => (
              <Cell
                key={index}
                fill={index === todayIndex ? TODAY_COLOR : BAR_COLOR}
                fillOpacity={index === todayIndex ? 1 : 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#2b7fff] inline-block opacity-70" /> Kursanzahl
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#f97316] inline-block" /> Heute
        </span>
      </div>
    </div>
  );
};

export default WeekdayChart;
