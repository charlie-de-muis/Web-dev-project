import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterScreen() {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    errorMessage: "",
    successMessage: "",
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the payload with all necessary fields
    const registerPayload = {
      UserId: "1", 
      FirstName: state.firstName,
      LastName: state.lastName,
      Email: state.email,
      Password: state.password,
      RecuringDays: "ma,di,wo,do,vr,za,zo", // You can update this based on user input
      Attendances: [], 
      Event_Attendances: [], 
    };

    try {
      const response = await fetch("http://localhost:5097/api/v1/login/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerPayload),
      });

      if (response.ok) {
        const data = await response.text();
        setState({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          errorMessage: "Registration failed. Please try again",
          successMessage: "Registration successful! You can now log in.",
        });
        // Redirect to login page or homepage
        setTimeout(() => {
          navigate("/login");
        }, 2000); // 2 seconds delay to see success message
      } else {
        const errorMessage = await response.text();
        setState((prevState) => ({
          ...prevState,
          errorMessage: errorMessage,
          successMessage: "",
        }));
      }
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Failed to connect to the server.",
        successMessage: "",
      }));
    }
  };

// styling
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      width: "100%",
      maxWidth: "400px",
      margin: "50px auto",
      textAlign: "center",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Roboto', sans-serif",
    },
    heading: {
      fontSize: "1.8rem",
      color: "#202124",
      marginBottom: "20px",
    },
    inputGroup: {
      marginBottom: "15px",
      textAlign: "left",
    },
    label: {
      display: "block",
      fontSize: "0.9rem",
      color: "#5f6368",
      marginBottom: "5px",
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      fontSize: "1rem",
      border: "1px solid #ddd",
      borderRadius: "4px",
      boxSizing: "border-box",
      outline: "none",
      marginBottom: "8px",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#4285F4", 
    },
    button: {
      width: "100%",
      padding: "12px",
      fontSize: "1.1rem",
      backgroundColor: "#4285F4", 
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#357ae8", 
    },
    message: {
      fontSize: "0.9rem",
      marginTop: "10px",
    },
    error: {
      color: "red",
    },
    success: {
      color: "green",
    },
    backButton: {
      marginTop: "15px",
      display: "inline-block",
      padding: "8px 12px",
      fontSize: "1rem",
      color: "#4285F4",
      textDecoration: "none",
      borderRadius: "4px",
      border: "1px solid #4285F4",
      transition: "background-color 0.3s ease",
    },
    backButtonHover: {
      backgroundColor: "#f1f3f4", 
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Register</h1>
      <form onSubmit={handleRegister}>
        <div style={styles.inputGroup}>
          <label htmlFor="firstName" style={styles.label}>
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={state.firstName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="lastName" style={styles.label}>
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={state.lastName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={state.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={state.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor as string)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor as string)}
        >
          Register
        </button>
      </form>

      {state.errorMessage && (
        <p style={{ ...styles.message, ...styles.error }}>{state.errorMessage}</p>
      )}
      {state.successMessage && (
        <p style={{ ...styles.message, ...styles.success }}>{state.successMessage}</p>
      )}

      <a
        href="http://localhost:5097/"
        style={styles.backButton}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.backButtonHover.backgroundColor as string)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}
      >
        Back
      </a>
    </div>
  );
}
