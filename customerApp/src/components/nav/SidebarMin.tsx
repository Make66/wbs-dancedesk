import { ImUsers } from "react-icons/im";
import { IoSchool, IoSettingsSharp } from "react-icons/io5";
import { MdDashboard, MdMeetingRoom } from "react-icons/md";
import { FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";
import { NavLink } from "react-router";
import { MapPin } from "lucide-react";
import { userStore } from "../../stores/userStore";
import { cn } from "../../lib/utils";

const iconClass = "text-2xl fill-current";

const SidebarMin = () => {
  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      <button
        className="py-3 px-2 hover:bg-gray-700 rounded-xl"
        onClick={() => userStore.setState({ isSidebarOpen: true })}
      >
        <MapPin className="text-2xl cursor-pointer stroke-gray-300" />
      </button>

      {[
        { to: "/", icon: <MdDashboard className={iconClass} /> },
        { to: "/courses", icon: <IoSchool className={iconClass} /> },
        { to: "/calendar", icon: <FaCalendarAlt className={iconClass} /> },
        { to: "/participants", icon: <ImUsers className={iconClass} /> },
        { to: "/instructors", icon: <FaChalkboardTeacher className={iconClass} /> },
        { to: "/rooms", icon: <MdMeetingRoom className={iconClass} /> },
        { to: "/settings", icon: <IoSettingsSharp className={iconClass} /> },
      ].map(({ to, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "p-2 rounded-xl transition-all duration-200",
              isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
              "py-3 px-2",
            )
          }
        >
          {icon}
        </NavLink>
      ))}
    </div>
  );
};

export default SidebarMin;
