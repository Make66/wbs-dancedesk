import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Course } from "../types/course-types";

type CourseSeatChartProps = {
  course: Course;
};

const COLORS = {
  occupied: "#ef4444",
  available: "#22c55e",
};

const CourseSeatChart = ({ course }: CourseSeatChartProps) => {
  const seatsMax = Math.max(course.seatsMax, 0);
  const occupiedSeats = Math.min(Math.max(course.seatsCurrent, 0), seatsMax);
  const availableSeats = Math.max(seatsMax - occupiedSeats, 0);
  const occupancyPercent = seatsMax > 0 ? Math.round((occupiedSeats / seatsMax) * 100) : 0;

  const data = [
    {
      name: "Belegt",
      value: occupiedSeats,
      color: COLORS.occupied,
    },
    {
      name: "Verfügbar",
      value: availableSeats,
      color: COLORS.available,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Platzauslastung</h3>
          <p className="text-sm text-gray-500">
            {occupiedSeats} von {seatsMax} Plätzen belegt
          </p>
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {occupancyPercent}%
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <div className="relative h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
                cornerRadius={8}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number | string, name: string) => {
                  const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                  const percent = seatsMax > 0 ? Math.round((numericValue / seatsMax) * 100) : 0;

                  return [`${numericValue} Plätze (${percent}%)`, name];
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{occupancyPercent}%</span>
            <span className="text-sm text-gray-500">belegt</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS.occupied }} />
              <span className="font-medium text-gray-800">Belegt</span>
            </div>
            <div className="text-sm text-gray-600">{occupiedSeats} Plätze</div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS.available }}
              />
              <span className="font-medium text-gray-800">Verfügbar</span>
            </div>
            <div className="text-sm text-gray-600">{availableSeats} Plätze</div>
          </div>

          <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Maximale Kapazität: <span className="font-semibold text-gray-900">{seatsMax}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSeatChart;
