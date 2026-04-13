import { LuUsers, LuBookOpen, LuUserCheck, LuTrendingUp } from "react-icons/lu";
import { userStore } from "../stores/userStore";
import StatCard from "../components/dashboard/StatCard";
import TodaysCourses from "../components/dashboard/TodaysCourses";
import RecentRegistrations from "../components/dashboard/RecentRegistrations";
import QuickActions from "../components/dashboard/QuickActions";
import DashboardCharts from "../components/dashboard/DashboardCharts";

const STATS = [
  {
    label: "Teilnehmer gesamt",
    value: 150,
    icon: <LuUsers />,
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    sub: "+5 diese Woche",
  },
  {
    label: "Aktive Kurse",
    value: 24,
    icon: <LuBookOpen />,
    iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    sub: "4 Kategorien",
  },
  {
    label: "Trainer",
    value: 8,
    icon: <LuUserCheck />,
    iconBg: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    sub: "2 heute aktiv",
  },
  {
    label: "Auslastung",
    value: "78%",
    icon: <LuTrendingUp />,
    iconBg: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    sub: "134 / 172 Plätze",
  },
];

const HomePage = () => {
  const user = userStore((state) => state.user);

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b border-gray-400 dark:border-gray-700 bg-background pl-6 z-20">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>

      <div className="p-6 space-y-6">
        <p className="text-muted-foreground">
          Herzlich Willkommen, <span className="font-semibold text-foreground">{user?.firstName} {user?.lastName}</span>
        </p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Heutige Kurse */}
        <TodaysCourses />

        {/* Charts */}
        <DashboardCharts />

        {/* Anmeldungen + Schnellzugriff */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentRegistrations />
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
