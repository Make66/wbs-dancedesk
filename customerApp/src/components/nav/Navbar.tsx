import { FaEnvelope, FaRegCircleUser } from "react-icons/fa6";
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
      } else {
        toast.error("Error logging out");
      }
    }
  };

  return (
    <nav className="w-full h-16 border-b border-gray-200 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-[8px] text-white font-bold bg-red-500 rounded-full">
            1
          </span>
          <FaEnvelope className="text-2xl cursor-pointer fill-gray-700" />
        </div>
        <FaRegCircleUser className="text-2xl cursor-pointer fill-gray-700" onClick={handleLogout} />
      </div>
    </nav>
  );
};

export default Navbar;
