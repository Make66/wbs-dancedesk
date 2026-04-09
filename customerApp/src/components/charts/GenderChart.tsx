import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { IoMaleFemaleOutline } from "react-icons/io5";
import type { ReactNode } from "react";

type CourseSeatChartProps = {
  male: number;
  female: number;
  other: number;
};

const COLORS = {
  male: "#2b7fff",
  female: "#f6339a",
  other: "#7ccf00",
};

type ChartItem = {
  name: string;
  value: number;
  color: string;
  icon: ReactNode;
};

type CustomLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  payload: ChartItem;
};

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, payload }: CustomLabelProps) => {
  const RADIAN = Math.PI / 180;

  // Position IM Kuchenstück
  const labelRadius = outerRadius * 0.62;

  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  return (
    <foreignObject x={x - 12} y={y - 12} width={40} height={24}>
      <div className="flex h-full w-full items-center justify-center font-bold">
        <span className="mr-1 text-xl">{payload.value}</span>
        <span>{payload.icon}</span>
      </div>
    </foreignObject>
  );
};

const GenderChart = ({ male, female, other }: CourseSeatChartProps) => {
  const data: ChartItem[] = [
    {
      name: "männlich",
      value: male,
      color: COLORS.male,
      icon: <IoMdMale />,
    },
    {
      name: "weiblich",
      value: female,
      color: COLORS.female,
      icon: <IoMdFemale />,
    },
    {
      name: "divers",
      value: other,
      color: COLORS.other,
      icon: <IoMaleFemaleOutline />,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="w-full">
      <div className="relative h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={0}
              outerRadius={95}
              paddingAngle={3}
              cornerRadius={8}
              stroke="none"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GenderChart;
