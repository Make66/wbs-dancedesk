import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DUMMY_DATA = [
  { month: "Nov", registrations: 18 },
  { month: "Dez", registrations: 12 },
  { month: "Jan", registrations: 27 },
  { month: "Feb", registrations: 34 },
  { month: "Mär", registrations: 29 },
  { month: "Apr", registrations: 41 },
];

const EnrollmentTrendChart = () => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h2 className="text-base font-semibold mb-1">Anmeldungen pro Monat</h2>
      <p className="text-xs text-muted-foreground mb-4">Letzte 6 Monate</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={DUMMY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
          <XAxis
            dataKey="month"
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
            cursor={{ stroke: "#8b5cf6", strokeWidth: 1, strokeOpacity: 0.3 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow">
                  <p className="font-semibold">{label}</p>
                  <p className="text-muted-foreground">{payload[0].value} Anmeldungen</p>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="registrations"
            stroke="#8b5cf6"
            strokeWidth={2.5}
            fill="url(#enrollmentGradient)"
            dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#8b5cf6", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6] inline-block" /> Neue Anmeldungen
        </span>
      </div>
    </div>
  );
};

export default EnrollmentTrendChart;
