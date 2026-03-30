import { FaEnvelope, FaRegCircleUser } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuth } from "../../context";

const Navbar = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleSignOut, signedIn, user } = useAuth();

  const handleLogout = async () => {
    try {
      await handleSignOut();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error);
      } else {
        toast.error("Error logging out");
      }
    }
  };

  return (
    <nav className="h-20 flex items-center px-6 absolute top-0 right-6 z-50">
      <div className="flex items-center gap-7">
        <div className="relative">
          <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-[8px] text-white font-bold bg-red-500 rounded-full">
            1
          </span>
          <FaEnvelope className="text-2xl cursor-pointer" />
        </div>
        <IoSettingsSharp className="text-2xl cursor-pointer" />
        <FaRegCircleUser className="text-2xl cursor-pointer" onClick={handleLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
