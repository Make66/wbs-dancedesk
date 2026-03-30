import { ImUsers } from "react-icons/im";
import { IoSchool } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { NavLink } from "react-router";
import { MapPin } from "lucide-react";
import { userStore } from "../../stores/userStore";
import { FaChalkboardTeacher } from "react-icons/fa";

const SidebarMin = () => {
  return (
    <div className="flex flex-col items-center gap-12 mt-6">
      <button onClick={() => userStore.setState({ isSidebarOpen: true })}>
        <MapPin className="text-4xl cursor-pointer fill-gray-300 ml-1" />
      </button>
      <NavLink to="/">
        <MdDashboard className="text-2xl cursor-pointer fill-gray-300" />
      </NavLink>
      <NavLink to="/courses">
        <IoSchool className="text-2xl cursor-pointer fill-gray-300" />
      </NavLink>
      <NavLink to="/users">
        <ImUsers className="text-2xl cursor-pointer fill-gray-300" />
      </NavLink>
      <NavLink to="/instructors">
        <FaChalkboardTeacher className="text-2xl cursor-pointer fill-gray-300" />
      </NavLink>
    </div>
  );
};

export default SidebarMin;
