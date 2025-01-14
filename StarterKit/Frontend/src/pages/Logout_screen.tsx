import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Call the logout API
        await fetch("http://localhost:5097/api/v1/Login/Logout", {
          method: "GET",
          credentials: "include", 
        });

        // Clear auth data from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAdmin");

        // Redirect to login page
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
