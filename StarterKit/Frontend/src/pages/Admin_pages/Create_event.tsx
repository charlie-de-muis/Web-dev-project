import React, { useState } from "react";

const CreateEventForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = {
      title,
      description,
      eventDate,
      startTime,
      endTime,
      location,
    };

    try {
      const response = await fetch("http://localhost:5097/api/v1/events/create", {
        method: "POST", // Use POST to create
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
        credentials: "include", // Make sure credentials (cookies) are sent
      });

      if (response.ok) {
        setSuccessMessage("Event created successfully!");
        setTitle("");
        setDescription("");
        setEventDate("");
        setStartTime("");
        setEndTime("");
        setLocation("");
      } else {
        const message = await response.text();
        setError(message || "Failed to create event");
      }
    } catch (err) {
      setError("An error occurred while creating the event.");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create Event</h1>
      {error && <div style={styles.error}>{error}</div>}
      {successMessage && <div style={styles.success}>{successMessage}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Event Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Event Date:</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Create Event</button>
      </form>
      <a href="/admin">
        <button style={styles.button}>Back</button>
      </a>
    </div>
  );
};

export default CreateEventForm;

// Google vibes styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "50px auto",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Roboto', sans-serif",
  },
  heading: {
    fontSize: "2rem",
    color: "#202124",
    marginBottom: "20px",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "1.1rem",
    color: "#202124",
    marginBottom: "5px",
    display: "block",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: {
    padding: "12px 20px",
    fontSize: "1.1rem",
    backgroundColor: "#4285F4", // Google's blue color
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    margin: "10px 0",
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
  success: {
    color: "green",
    marginBottom: "20px",
  },
};
