import { Navigate } from "react-router-dom";

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Redirect to login if there's no user in localStorage
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;
