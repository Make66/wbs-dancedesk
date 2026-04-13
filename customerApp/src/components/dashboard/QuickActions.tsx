import { Link } from "react-router";
import { LuPlus, LuUser, LuCalendar, LuDoorOpen } from "react-icons/lu";

type Action = {
  label: string;
  to: string;
  icon: React.ReactNode;
  color: string;
};

const ACTIONS: Action[] = [
  {
    label: "Kurs erstellen",
    to: "/course",
    icon: <LuPlus className="text-xl" />,
    color:
      "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40",
  },
  {
    label: "Teilnehmer",
    to: "/participants",
    icon: <LuUser className="text-xl" />,
    color:
      "bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40",
  },
  {
    label: "Kalender",
    to: "/calendar",
    icon: <LuCalendar className="text-xl" />,
    color:
      "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40",
  },
  {
    label: "Räume",
    to: "/rooms",
    icon: <LuDoorOpen className="text-xl" />,
    color:
      "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/40",
  },
];

const QuickActions = () => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
      <h2 className="text-base font-semibold mb-4">Schnellzugriff</h2>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-colors ${action.color}`}
          >
            {action.icon}
            <span className="text-xs font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
