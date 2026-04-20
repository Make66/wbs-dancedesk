import { NavLink, useLocation, useNavigate } from "react-router";
import { targetStore } from "../../stores/targetStore";
import { cn } from "../../lib/utils";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { FaCalendarAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { ChevronDown } from "lucide-react";
import { IoSettingsSharp } from "react-icons/io5";
import SidebarMin from "./SidebarMin";
import LocationPicker from "./LocationPicker";
import CourseTargetsLoader from "./DataLoader";
import { userStore } from "../../stores/userStore";
import SidebarTargetItem from "./SidebarTargetItem";

const Sidebar = () => {
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
      {isSidebarOpen && <LocationPicker />}
      <CourseTargetsLoader />
      {!isSidebarOpen ? (
        <SidebarMin />
      ) : (
        <div className="flex flex-col gap-6 mt-6 overflow-y-scroll scrollbar">
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
          <div className="border-b border-gray-500" />
          <div>
            <div className="">
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
            </div>
            {isCoursesActive && (
              <div>
                {activeTargets.map((target) => {
                  return <SidebarTargetItem className="ml-5" key={target.id} target={target} />;
                })}
              </div>
            )}
          </div>
          <div className="border-b border-gray-500" />
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              cn(
                "flex gap-3 rounded-xl py-3 px-2 transition-all duration-200",
                isActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white text-gray-300",
              )
            }
          >
            <FaCalendarAlt className="text-2xl cursor-pointer fill-current ml-2" />
            <span>Kalender</span>
          </NavLink>
          <div className="border-b border-gray-500" />
          <NavLink
            to="/participants"
            className={({ isActive }) =>
              cn(
                "flex gap-3 rounded-xl py-3 px-2 transition-all duration-200",
                isActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white text-gray-300",
              )
            }
          >
            <ImUsers className="text-2xl cursor-pointer fill-current ml-2" />
            <span>Teilnehmer</span>
          </NavLink>
          <div className="border-b border-gray-500" />

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex gap-3 rounded-xl py-3 px-2 mt-auto mb-4 transition-all duration-200",
                isActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white text-gray-300",
              )
            }
          >
            <IoSettingsSharp className="text-2xl cursor-pointer fill-current ml-2" />
            <span>Einstellungen</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
