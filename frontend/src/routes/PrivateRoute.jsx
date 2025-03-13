import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/Spinner.jsx";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return (
    <Spinner loading={loading} />
  );

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;