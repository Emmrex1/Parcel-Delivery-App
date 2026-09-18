import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const location = useLocation();

  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  // CHECK AUTHENTICATION
 
  const isLoggedIn = isAuthenticated && Boolean(token) && Boolean(user);

  // User is not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // CHECK CUSTOMER ROLE
  
  if (user.role !== "customer") {
    return <Navigate to="/" replace />;
  }

  // AUTHENTICATED CUSTOMER
  
  return <Outlet />;
};

export default ProtectedRoute;
