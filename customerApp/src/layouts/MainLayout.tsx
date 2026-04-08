import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context";
import Navbar from "../components/nav/Navbar";
import Sidebar from "../components/nav/Sidebar";

const MainLayout = () => {
  const { signedIn } = useAuth();

  if (signedIn) {
    return (
      <div className="h-screen flex mx-auto overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-screen w-full flex flex-col">
          <Navbar />
          <div className="flex-1 overflow-y-auto scrollbar">
            <Outlet />
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
};

export default MainLayout;
