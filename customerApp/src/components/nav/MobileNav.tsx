import { NavLink, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaEnvelope, FaRegCircleUser } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { IoSchool, IoSettingsSharp } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { ChevronDown, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../context";
import { targetStore } from "../../stores/targetStore";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import LocationPicker from "./LocationPicker";
import CourseTargetsLoader from "./DataLoader";
import SidebarTargetItem from "./SidebarTargetItem";

type MobileNavProps = {
  onClose: () => void;
};

const MobileNav = ({ onClose }: MobileNavProps) => {
  const { handleSignOut } = useAuth();
  const targets = targetStore((state) => state.targets);
  const activeTargets = targets.filter((target) => target.isActive);
  const [isCoursesExpanded, setIsCoursesExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isCoursesActive = location.pathname.startsWith("/courses");

  const handleLogout = async () => {
    try {
      await handleSignOut();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error logging out");
      }
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-4 rounded-xl py-4 px-4 text-lg transition-all duration-200",
      isActive
        ? "bg-gray-700 text-white"
        : "hover:bg-gray-700 hover:text-white text-gray-300",
    );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-800 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-600">
        <span className="text-gray-100 font-bold text-2xl">DanceDesk</span>
        <div className="flex items-center gap-5">
          <ThemeToggle />
          <div className="relative">
            <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-[8px] text-white font-bold bg-red-500 rounded-full">
              1
            </span>
            <FaEnvelope className="text-xl cursor-pointer text-gray-300" />
          </div>
          <FaRegCircleUser
            className="text-xl cursor-pointer text-gray-300"
            onClick={handleLogout}
          />
          <button
            onClick={onClose}
            className="p-2 bg-gray-600 hover:bg-gray-500 rounded-xl cursor-pointer"
            aria-label="Menü schließen"
          >
            <X className="stroke-gray-200 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <CourseTargetsLoader />
        <LocationPicker />

        <nav className="flex flex-col gap-2 mt-2">
          <NavLink to="/" className={linkClass} onClick={onClose}>
            <MdDashboard className="text-2xl fill-current" />
            <span>Dashboard</span>
          </NavLink>

          <div className="border-b border-gray-600 my-1" />

          {/* Kurse */}
          <div>
            <div
              onClick={() => {
                setIsCoursesExpanded(true);
                navigate("/courses");
                onClose();
              }}
              className={cn(
                "flex items-center justify-between rounded-xl py-4 px-4 text-lg transition-all duration-200 cursor-pointer",
                isCoursesActive
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-700 hover:text-white text-gray-300",
              )}
            >
              <div className="flex items-center gap-4">
                <IoSchool className="text-2xl fill-current" />
                <span>Kurse</span>
              </div>
              <button
                type="button"
                className="cursor-pointer p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCoursesExpanded((prev) => !prev);
                }}
                aria-label={isCoursesExpanded ? "Kurse einklappen" : "Kurse ausklappen"}
              >
                <ChevronDown
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isCoursesExpanded && "rotate-180",
                  )}
                />
              </button>
            </div>

            {isCoursesExpanded && (
              <div onClick={onClose} className="ml-4">
                {activeTargets.map((target) => (
                  <SidebarTargetItem className="ml-4" key={target.id} target={target} />
                ))}
              </div>
            )}
          </div>

          <div className="border-b border-gray-600 my-1" />

          <NavLink to="/calendar" className={linkClass} onClick={onClose}>
            <FaCalendarAlt className="text-2xl fill-current" />
            <span>Kalender</span>
          </NavLink>

          <div className="border-b border-gray-600 my-1" />

          <NavLink to="/participants" className={linkClass} onClick={onClose}>
            <ImUsers className="text-2xl fill-current" />
            <span>Teilnehmer</span>
          </NavLink>

          <div className="border-b border-gray-600 my-1" />

          <NavLink to="/settings" className={linkClass} onClick={onClose}>
            <IoSettingsSharp className="text-2xl fill-current" />
            <span>Einstellungen</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default MobileNav;
