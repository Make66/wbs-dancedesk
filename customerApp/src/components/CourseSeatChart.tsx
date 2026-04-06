import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
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
    <div className="w-full rounded-2xl p-6">
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
              formatter={(value: ValueType | undefined, name: NameType | undefined) => {
                const normalizedValue = Array.isArray(value) ? value[0] : value;
                const numericValue =
                  typeof normalizedValue === "number" ? normalizedValue : Number(normalizedValue ?? 0);
                const percent = seatsMax > 0 ? Math.round((numericValue / seatsMax) * 100) : 0;

                return [`${numericValue} Plätze (${percent}%)`, name ?? ""];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{occupancyPercent}%</span>
          <span className="text-sm text-muted-foreground">belegt</span>
        </div>
      </div>
    </div>
  );
};

export default CourseSeatChart;
