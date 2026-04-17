import {
  LuUsers,
  LuBookOpen,
  LuUserCheck,
  LuTrendingUp,
  LuCheck,
  LuRotateCcw,
} from "react-icons/lu";
import { userStore } from "../stores/userStore";
import StatCard from "../components/dashboard/StatCard";
import TodaysCourses from "../components/dashboard/TodaysCourses";
import RecentRegistrations from "../components/dashboard/RecentRegistrations";
import QuickActions from "../components/dashboard/QuickActions";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import SortableWidget from "../components/dashboard/SortableWidget";
import { useDashboardLayout, type WidgetId } from "../hooks/useDashboardLayout";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import EditButton from "../components/ui/EditButton";

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
    label: "Aktive Instruktoren",
    value: 6,
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

const WIDGET_LABELS: Record<WidgetId, string> = {
  stats: "Statistiken",
  "todays-courses": "Heutige Kurse",
  charts: "Diagramme",
  "bottom-row": "Anmeldungen & Schnellaktionen",
};

const HomePage = () => {
  const user = userStore((state) => state.user);
  const { order, editMode, setEditMode, handleDragEnd, resetOrder } = useDashboardLayout();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      handleDragEnd(String(active.id), String(over.id));
    }
  };

  const renderWidget = (id: WidgetId) => {
    switch (id) {
      case "stats":
        return (
          <SortableWidget key={id} id={id} editMode={editMode}>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </SortableWidget>
        );
      case "todays-courses":
        return (
          <SortableWidget key={id} id={id} editMode={editMode}>
            <TodaysCourses />
          </SortableWidget>
        );
      case "charts":
        return (
          <SortableWidget key={id} id={id} editMode={editMode}>
            <DashboardCharts />
          </SortableWidget>
        );
      case "bottom-row":
        return (
          <SortableWidget key={id} id={id} editMode={editMode}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <RecentRegistrations />
              </div>
              <QuickActions />
            </div>
          </SortableWidget>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="sticky top-0 flex items-center gap-6 h-20 border-b border-gray-400 dark:border-gray-700 bg-background pl-6 pr-4 z-20">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-2">
          {editMode && (
            <button
              onClick={() => {
                resetOrder();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md
                border border-border text-muted-foreground hover:text-foreground
                hover:bg-muted transition-colors"
              title="Reihenfolge zurücksetzen"
            >
              <LuRotateCcw size={14} />
              Zurücksetzen
            </button>
          )}
          <div
            onClick={() => setEditMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer
              ${
                editMode
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                  : ""
              }`}
          >
            {editMode ? <LuCheck size={14} /> : <EditButton />}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Herzlich Willkommen,{" "}
            <span className="font-semibold text-foreground">
              {user?.firstName} {user?.lastName}
            </span>
          </p>
          <p className="mr-3">{format(new Date(), "EEEE, d. MMMM yyyy", { locale: de })}</p>
        </div>

        {editMode && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            Ziehe die Kacheln am Gripper-Symbol um sie neu anzuordnen.
          </p>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {order.map((id) => (
                <div key={id} className="relative">
                  {editMode && (
                    <span className="absolute -top-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 z-10">
                      {WIDGET_LABELS[id]}
                    </span>
                  )}
                  {renderWidget(id)}
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default HomePage;
