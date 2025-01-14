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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
        credentials: "include", 
      });
      

      if (response.ok) {
        const responseData = await response.text();
        const isAdmin = responseData.includes("admin");

        localStorage.setItem("authToken", "true");
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        const errorMessage = await response.text();
        setState((prevState) => ({
          ...prevState,
          errorMessage,
        }));
      }
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Failed to connect to the server.",
      }));
    }
  };

  // styling
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    form: {
      width: "300px",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
    },
    title: {
      fontSize: "1.8rem",
      color: "#202124",
      marginBottom: "1.5rem",
      textAlign: "center" as const,
    },
    inputContainer: {
      marginBottom: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    label: {
      marginBottom: "0.5rem",
      fontSize: "1rem",
      color: "#5f6368",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      border: "1px solid #dadce0",
      borderRadius: "4px",
      outline: "none",
      transition: "border-color 0.2s ease",
    },
    inputFocus: {
      borderColor: "#4285F4",
    },
    button: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#4285F4",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginTop: "1rem",
    },
    buttonHover: {
      backgroundColor: "#357ae8",
    },
    error: {
      color: "red",
      marginTop: "1rem",
      textAlign: "center" as const,
    },
    backButton: {
      marginTop: "1rem",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleLogin}>
        <h1 style={styles.title}>Login</h1>
        <div style={styles.inputContainer}>
          <label style={styles.label} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={state.username}
            onChange={handleChange}
            style={styles.input}
            onFocus={(e) => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor! as string)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#dadce0")}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={state.password}
            onChange={handleChange}
            style={styles.input}
            onFocus={(e) => (e.currentTarget.style.borderColor = styles.inputFocus.borderColor! as string)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#dadce0")}
            required
          />
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor! as string)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor! as string)}
        >
          Login
        </button>
        {state.errorMessage && <p style={styles.error}>{state.errorMessage}</p>}
        <a href="/" style={styles.backButton}>
          <button
            type="button"
            style={styles.button}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor! as string)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor! as string)}
          >
            Back
          </button>
        </a>
      </form>
    </div>
  );
};

export default LoginScreen;
