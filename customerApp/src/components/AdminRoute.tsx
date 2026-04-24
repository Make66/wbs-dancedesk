import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context";

const AdminRoute = () => {
  const { signedIn, user } = useAuth();
  if (!signedIn) return <Navigate to="/login" />;
  if (user?.role !== "admin") return <Navigate to="/" />;
  return <Outlet />;
};

export default AdminRoute;
