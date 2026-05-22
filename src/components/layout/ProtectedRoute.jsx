import { Navigate, Outlet } from "react-router-dom";
import AnalyticsTracker from "../../AnalyticsTracker";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return(
    <>
    <AnalyticsTracker/>
    <Outlet/>
    </>)
}
