import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  sub?: string;
};

const StatCard = ({ label, value, icon, iconBg = "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", sub }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 flex items-center gap-4 shadow-sm">
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
