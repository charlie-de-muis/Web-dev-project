import React, { useState, useEffect } from "react";

const workdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ChangeWorkdaysPage: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    console.log("AuthToken retrieved from localStorage:", authToken);

    if (authToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, []);

  const handleDayChange = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((selectedDay) => selectedDay !== day)
        : [...prevSelectedDays, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDays.length === 0) {
      setMessage("Please select at least one workday.");
      return;
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setMessage("You need to log in to update workdays.");
      return;
    }

    const newWorkdays = selectedDays.join(", ");

    try {
      const response = await fetch("/api/v1/attendance/workdays", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          NewDays: newWorkdays,
        }),
      });

      if (response.ok) {
        setMessage("Workdays updated successfully.");
        setTimeout(() => {
          window.location.href = "/user";
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update workdays.");
      }
    } catch (error) {
      setMessage("An error occurred while updating workdays.");
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  }

  if (!isLoggedIn) {
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        You must be logged in to update workdays.
      </p>
    );
  }

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: "600px",
      margin: "2rem auto",
      padding: "2rem",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      fontSize: "1.8rem",
      color: "#202124",
      textAlign: "center",
      marginBottom: "1rem",
    },
    message: {
      fontSize: "1rem",
      color: message.includes("successfully") ? "green" : "red",
      textAlign: "center",
      marginBottom: "1rem",
    },
    checkboxContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    checkboxItem: {
      display: "flex",
      alignItems: "center",
    },
    label: {
      marginLeft: "0.5rem",
      fontSize: "1rem",
      color: "#5f6368",
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
      textAlign: "center",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#357ae8",
    },
    backButton: {
      marginTop: "1rem",
      width: "100%",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "1rem",
      color: "#4285F4",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Change Workdays</h1>
      {message && <p style={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <h3 style={styles.title}>Select Your Workdays</h3>
        <div style={styles.checkboxContainer}>
          {workdays.map((day) => (
            <div style={styles.checkboxItem} key={day}>
              <input
                type="checkbox"
                id={day}
                name={day}
                value={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleDayChange(day)}
              />
              <label htmlFor={day} style={styles.label}>
                {day}
              </label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor!)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor!)}
        >
          Submit
        </button>
      </form>
      <a href="/user" style={styles.backButton}>
        Back
      </a>
    </div>
  );
};

export default ChangeWorkdaysPage;
