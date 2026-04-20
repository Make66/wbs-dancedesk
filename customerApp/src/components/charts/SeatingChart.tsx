import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type CourseSeatChartProps = {
  seatsCurrent: number;
  maxSeats: number;
};

const COLORS = {
  occupied: "#ef4444",
  available: "#22c55e",
};

const SeatingChart = ({ seatsCurrent, maxSeats }: CourseSeatChartProps) => {
  const seatsMax = Math.max(maxSeats, 0);
  const occupiedSeats = Math.min(Math.max(seatsCurrent, 0), seatsMax);
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
    <div className="w-full">
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
          </PieChart>
        </ResponsiveContainer>

        <div className="hidden pointer-events-none absolute inset-0 md:flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-foreground">{occupancyPercent}%</span>
          <span className="text-sm text-muted-foreground">belegt</span>
        </div>
      </div>
    </div>
  );
};

export default SeatingChart;
