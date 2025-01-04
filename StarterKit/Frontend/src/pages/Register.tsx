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
        UserId: "1",  // You can set this dynamically if needed
        FirstName: state.firstName,
        LastName: state.lastName,
        Email: state.email,
        Password: state.password,
        RecuringDays: "ma,di,wo",  // You can update this based on user input
        Attendances: [],  // Empty list as per the example
        Event_Attendances: []  // Empty list as per the example
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
                errorMessage: "",
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


  return (
    <div style={{ width: "300px", margin: "50px auto", textAlign: "center" }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={state.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={state.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={state.email}
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
        <button type="submit">Register</button>
      </form>

      {state.errorMessage && <p style={{ color: "red" }}>{state.errorMessage}</p>}
      {state.successMessage && <p style={{ color: "green" }}>{state.successMessage}</p>}
    </div>
  );
}
