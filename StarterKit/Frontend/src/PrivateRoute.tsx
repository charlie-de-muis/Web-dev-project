import React from "react";
import { Navigate, Route } from "react-router-dom";

// PrivateRoute component
interface PrivateRouteProps {
  element: React.ReactNode;  // Directly define the "element" prop
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  // Check if the user is authenticated
  const isAuthenticated = localStorage.getItem("authToken"); // Replace with your actual authentication check

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // Render the protected route if authenticated
  return <>{element}</>; // Wrap the element directly here
};

export default PrivateRoute;