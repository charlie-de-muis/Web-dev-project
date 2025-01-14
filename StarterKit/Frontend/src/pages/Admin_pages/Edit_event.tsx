import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditEventForm: React.FC = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Fetch the event data from the backend to pre-fill the form
    const fetchEventData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5097/api/v1/Events/${id}`, // Fetch the event by ID
          { method: "GET", credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setEventData({
            title: data.title,
            description: data.description,
            eventDate: data.eventDate,
            startTime: data.startTime,
            endTime: data.endTime,
            location: data.location,
          });
        } else {
          setError("Event not found.");
        }
      } catch (error) {
        setError("Failed to fetch event data.");
        console.error(error);
      }
    };

    fetchEventData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedEvent = {
      title: eventData.title,
      description: eventData.description,
      eventDate: eventData.eventDate,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      location: eventData.location,
      event_Attendances: [] // Ensure that this field is present, even if it's empty
    };

    try {
      const response = await fetch(
        `http://localhost:5097/api/v1/events/update/${id}`, // Use PUT to update
        {
          method: "PUT", // PUT method to update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
          credentials: "include",
        }
      );

      if (response.ok) {
        navigate("/admin"); // Redirect to the admin dashboard after successful update
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || "Failed to update event.");
      }
    } catch (err) {
      setError("An error occurred while updating the event.");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Edit Event</h1>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Event Title:</label>
          <input
            type="text"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Description:</label>
          <textarea
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Event Date:</label>
          <input
            type="date"
            value={eventData.eventDate}
            onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Start Time:</label>
          <input
            type="time"
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>End Time:</label>
          <input
            type="time"
            value={eventData.endTime}
            onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Location:</label>
          <input
            type="text"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.submitButton}>Update Event</button>
      </form>
      <a href="/admin">
        <button style={styles.backButton}>Back</button>
      </a>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as "column",  // Ensure "column" is explicitly typed
  },
  formGroup: {
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginTop: "5px",
    fontSize: "1rem",
    width: "100%",
  },
  submitButton: {
    padding: "10px 20px",
    fontSize: "1.1rem",
    backgroundColor: "#4285F4", // Google's blue
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "20px",
  },
  backButton: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#f1f3f4", // Light gray for the neutral back button
    color: "#202124",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
};


export default EditEventForm;
