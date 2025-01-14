import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Modal to ask for Event ID (Reusable for Edit, Delete, and Attendees)
const EventIdPopup: React.FC<{ 
  action: "edit" | "delete" | "attendees"; 
  onSubmit: (eventId: string) => void; 
}> = ({ action, onSubmit }) => {
  const [eventId, setEventId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false); // Controls whether the popup is shown

  const handleSubmit = () => {
    if (eventId) {
      onSubmit(eventId); // Trigger the action-specific handler
      setIsOpen(false); // Close the popup after submission
    } else {
      alert("Please enter a valid event ID.");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        style={styles.button}
      >
        {action === "edit" && "Edit Event"}
        {action === "delete" && "Delete Event"}
        {action === "attendees" && "View Attendees"}
      </button>

      {isOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>{action === "edit" && "Enter Event ID to Edit"}</h2>
            <h2>{action === "delete" && "Enter Event ID to Delete"}</h2>
            <h2>{action === "attendees" && "Enter Event ID to View Attendees"}</h2>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="Enter Event ID"
              style={styles.input}
            />
            <div>
              <button onClick={handleSubmit} style={styles.button}>Submit</button>
              <button onClick={() => setIsOpen(false)} style={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Admin_loggedin component
export default function Admin_loggedin() {
  const navigate = useNavigate();

  const handleEditSubmit = (eventId: string) => {
    navigate(`/admin/update-event/${eventId}`);
  };

  const handleDeleteSubmit = (eventId: string) => {
    navigate(`/admin/delete-event/${eventId}`);
  };

  const handleAttendeesSubmit = (eventId: string) => {
    navigate(`/admin/attendees/${eventId}`);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome admin!</h1>
      <a href="http://localhost:5097/admin/events">
        <button style={styles.button}>See events</button>
      </a>
      <a href="http://localhost:5097/admin/create-event">
        <button style={styles.button}>Create event</button>
      </a>
      {/* Edit Event Popup */}
      <EventIdPopup action="edit" onSubmit={handleEditSubmit} />
      {/* Delete Event Popup */}
      <EventIdPopup action="delete" onSubmit={handleDeleteSubmit} />
      {/* Attendees Popup */}
      <EventIdPopup action="attendees" onSubmit={handleAttendeesSubmit} />
      <a href="http://localhost:5097/Logout">
        <button style={styles.button}>Log out</button>
      </a>
    </div>
  );
}

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
  buttonHover: {
    backgroundColor: "#357ae8", // Slightly darker blue for hover
  },
  cancelButton: {
    padding: "12px 20px",
    fontSize: "1.1rem",
    backgroundColor: "#f1f3f4", // Light grey for the cancel button
    color: "#5f6368",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    margin: "10px 0",
    width: "100%",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
    outline: "none",
    marginBottom: "20px",
    transition: "border-color 0.3s ease",
  },
  inputFocus: {
    borderColor: "#4285F4", // Blue color for focus
  },
};
