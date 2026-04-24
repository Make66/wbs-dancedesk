import { NavLink, useLocation, useNavigate } from "react-router";
import { targetStore } from "../../stores/targetStore";
import { cn } from "../../lib/utils";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { FaCalendarAlt, FaNewspaper } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { IoSettingsSharp } from "react-icons/io5";
import SidebarMin from "./SidebarMin";
import LocationPicker from "./LocationPicker";
import CourseTargetsLoader from "./DataLoader";
import { userStore } from "../../stores/userStore";
import SidebarTargetItem from "./SidebarTargetItem";
import { useAuth } from "../../context";
import { ThemeToggle } from "./ThemeToggle";
import { toast } from "react-toastify";
import { useModuleAccess, MODULE } from "../../lib/useModuleAccess";

const Sidebar = () => {
  const { user, handleSignOut } = useAuth();

  const handleLogout = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Fehler beim Abmelden.");
    }
  };
  const has = useModuleAccess();
  const isSidebarOpen = userStore((state) => state.isSidebarOpen);
  const targets = targetStore((state) => state.targets);
  const activeTargets = targets.filter((target) => target.isActive);
  const location = useLocation();
  const isCoursesActive = location.pathname.startsWith("/courses");
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        isSidebarOpen ? "min-w-74 px-5" : "w-16 px-2",
        "h-screen hidden md:flex flex-col bg-zinc-800 transition-all duration-200",
      )}
    >
      <div className="flex py-4 items-center justify-between h-20 mb-4">
        {isSidebarOpen && <div className="text-gray-300 font-bold text-2xl pt-1">DanceDesk</div>}
        <button
          className={cn(
            !isSidebarOpen && "ml-2",
            "p-2 bg-gray-600 hover:bg-gray-500 rounded-xl cursor-pointer",
          )}
          onClick={() => userStore.setState({ isSidebarOpen: !isSidebarOpen })}
        >
          {isSidebarOpen ? (
            <LuArrowLeftToLine className="stroke-gray-300" />
          ) : (
            <LuArrowRightToLine className="stroke-gray-300" />
          )}
        </button>
      </div>
      <CourseTargetsLoader />
      {!isSidebarOpen ? (
        <SidebarMin />
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-col gap-6 mt-6 overflow-y-scroll scrollbar flex-1 pb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex gap-3 rounded-xl py-3 px-2 transition-all duration-200",
                isActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white text-gray-300",
              )
            }
          >
            <MdDashboard className="text-2xl cursor-pointer fill-current ml-2" />
            <span>Dashboard</span>
          </NavLink>
          {isSidebarOpen && <LocationPicker />}
          {has(MODULE.KURSE) && (
            <div>
              <div
                onClick={() => navigate("/courses")}
                className={cn(
                  "flex items-center justify-between rounded-xl py-3 px-2 transition-all duration-200 cursor-pointer",
                  isCoursesActive
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700 hover:text-white text-gray-300",
                )}
              >
                <div className="flex items-center gap-4 pl-2">
                  <IoSchool className="text-2xl fill-current" />
                  <span>Kurse</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 mr-3 transition-transform duration-200",
                    isCoursesActive && "rotate-180",
                  )}
                />
              </div>
              {isCoursesActive && (
                <div>
                  {activeTargets.map((target) => (
                    <SidebarTargetItem className="ml-5" key={target.id} target={target} />
                  ))}
                </div>
              )}
            </div>
          )}
          {has(MODULE.KALENDER) && (
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                cn(
                  "flex gap-3 rounded-xl py-3 px-2 transition-all duration-200",
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-300",
                )
              }
            >
              <FaCalendarAlt className="text-2xl cursor-pointer fill-current ml-2" />
              <span>Kalender</span>
            </NavLink>
          )}
          {has(MODULE.TEILNEHMER) && (
            <NavLink
              to="/participants"
              className={({ isActive }) =>
                cn(
                  "flex gap-3 rounded-xl py-3 px-2 transition-all duration-200",
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-300",
                )
              }
            >
              <ImUsers className="text-2xl cursor-pointer fill-current ml-2" />
              <span>Teilnehmer</span>
            </NavLink>
          )}
          {has(MODULE.NEWS) && (
            <NavLink
              to="/posts"
              className={({ isActive }) =>
                cn(
                  "flex gap-3 rounded-xl py-3 px-2 transition-all duration-200",
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 hover:text-white text-gray-300",
                )
              }
            >
              <FaNewspaper className="text-2xl cursor-pointer fill-current ml-2" />
              <span>News</span>
            </NavLink>
          )}

        </div>
        <div className="flex flex-col border-t border-gray-600 py-2">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex gap-3 rounded-xl py-3 px-2 transition-all duration-200",
                isActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white text-gray-300",
              )
            }
          >
            <IoSettingsSharp className="text-2xl cursor-pointer fill-current ml-2" />
            <span>Einstellungen</span>
          </NavLink>
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "flex gap-3 rounded-xl py-3 px-2 transition-all duration-200",
                  isActive
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700 hover:text-white text-gray-300",
                )
              }
            >
              <ShieldCheck className="text-2xl cursor-pointer ml-2 w-6 h-6" />
              <span>Admin</span>
            </NavLink>
          )}
          <div className="flex items-center justify-end gap-4 px-4 py-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Abmelden"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
