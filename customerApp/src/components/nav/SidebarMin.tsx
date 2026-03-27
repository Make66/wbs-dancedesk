import { ImUsers } from "react-icons/im";
import { IoSchool } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { NavLink } from "react-router";

const SidebarMin = () => {
  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      <NavLink to="/">
        <MdDashboard className="text-2xl cursor-pointer fill-gray-300" />
      </NavLink>
      <NavLink to="/courses">
        <IoSchool className="text-2xl cursor-pointer fill-gray-300" />
      </NavLink>
      <NavLink to="/users">
        <ImUsers className="text-2xl cursor-pointer fill-gray-300" />
      </NavLink>
    </div>
  );
};

export default SidebarMin;
