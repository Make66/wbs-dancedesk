import { ImUsers } from "react-icons/im";
import { IoSchool, IoSettingsSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaCalendarAlt, FaNewspaper } from "react-icons/fa";
import { NavLink } from "react-router";
import { MapPin } from "lucide-react";
import { userStore } from "../../stores/userStore";
import { cn } from "../../lib/utils";
import { useModuleAccess, MODULE } from "../../lib/useModuleAccess";

const iconClass = "text-2xl fill-current";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "py-3 px-2 rounded-xl transition-all duration-200",
    isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
  );

const SidebarMin = () => {
  const has = useModuleAccess();

  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      <NavLink to="/" className={navLinkClass}>
        <MdDashboard className={iconClass} />
      </NavLink>

      <button
        className="py-3 px-2 hover:bg-gray-700 rounded-xl"
        onClick={() => userStore.setState({ isSidebarOpen: true })}
      >
        <MapPin className="text-2xl cursor-pointer stroke-gray-300" />
      </button>

      {has(MODULE.KURSE) && (
        <NavLink to="/courses" className={navLinkClass}>
          <IoSchool className={iconClass} />
        </NavLink>
      )}
      {has(MODULE.KALENDER) && (
        <NavLink to="/calendar" className={navLinkClass}>
          <FaCalendarAlt className={iconClass} />
        </NavLink>
      )}
      {has(MODULE.TEILNEHMER) && (
        <NavLink to="/participants" className={navLinkClass}>
          <ImUsers className={iconClass} />
        </NavLink>
      )}
      {has(MODULE.NEWS) && (
        <NavLink to="/posts" className={navLinkClass}>
          <FaNewspaper className={iconClass} />
        </NavLink>
      )}
      <NavLink to="/settings" className={navLinkClass}>
        <IoSettingsSharp className={iconClass} />
      </NavLink>
    </div>
  );
};

export default SidebarMin;
