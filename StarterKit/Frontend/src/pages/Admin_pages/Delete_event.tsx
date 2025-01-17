import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const DeleteEvent: React.FC = () => {
  const { eventId } = useParams();
  const [isOpen, setIsOpen] = useState(true); // Automatically show the popup when component loads
  const navigate = useNavigate();

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`http://localhost:5097/api/v1/events/delete/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("Response Status:", response.status);

      if (response.ok) {
        alert("Event deleted successfully.");
        navigate("/admin/events");
      } else if (response.status === 404) {
        alert("Event not found.");
      } else if (response.status === 401) {
        alert("Unauthorized: Only admins can delete events.");
      } else {
        alert("Failed to delete event. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    navigate("/admin/events"); // Redirect to events list if cancelled
  };

  return isOpen ? (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h2 style={styles.modalHeading}>Confirm Deletion</h2>
        <p style={styles.modalText}>
          Are you sure you want to delete the event with ID {eventId}?
        </p>
        <div>
          <button onClick={handleDeleteEvent} style={styles.confirmButton}>
            Confirm
          </button>
          <button onClick={handleCancel} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

// Simple inline CSS for the modal with Google vibes
const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  textAlign: "center",
};

const styles = {
  modalHeading: {
    fontSize: "1.5rem",
    color: "#202124",
    marginBottom: "10px",
  },
  modalText: {
    color: "#202124",
    fontSize: "1rem",
    marginBottom: "20px",
  },
  confirmButton: {
    padding: "10px 20px",
    fontSize: "1.1rem",
    backgroundColor: "#4285F4", // Google's blue color
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    margin: "10px",
    width: "120px",
  },
  cancelButton: {
    padding: "10px 20px",
    fontSize: "1.1rem",
    backgroundColor: "#f1f3f4", // Light gray for the neutral cancel button
    color: "#202124",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    margin: "10px",
    width: "120px",
  },
};

export default DeleteEvent;
