import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginScreenState {
  username: string;
  password: string;
  errorMessage: string;
}

const LoginScreen: React.FC = () => {
  const [state, setState] = useState<LoginScreenState>({
    username: "",
    password: "",
    errorMessage: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginPayload: LoginRequest = {
      username: state.username,
      password: state.password,
    };

    try {
      const response = await fetch("http://localhost:5097/api/v1/Login/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
      });

      if (response.ok) {
        // If login is successful, process the response
        const responseData = await response.text();
        
        // Mocked for this example, assume response contains the role info
        const isAdmin = responseData.includes("admin");

        // Store the user's authentication status in localStorage
        localStorage.setItem("authToken", "true");  // Set auth token to simulate authenticated user
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false"); // Store user role (admin or regular user)

        // Redirect based on user role
        if (isAdmin) {
          navigate("/admin"); // Redirect to admin dashboard if admin
        } else {
          navigate("/user"); // Redirect to user dashboard if regular user
        }
      } else {
        // Handle error if response is not ok
        const errorMessage = await response.text();
        setState((prevState) => ({
          ...prevState,
          errorMessage,
        }));
      }
    } catch (error) {
      // Handle network or server errors
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Failed to connect to the server.",
      }));
    }
  };

  return (
    <div style={{ width: "300px", margin: "50px auto", textAlign: "center" }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={state.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={state.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {state.errorMessage && <p style={{ color: "red" }}>{state.errorMessage}</p>}
    </div>
  );
};

export default LoginScreen;
