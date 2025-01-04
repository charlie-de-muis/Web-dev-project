import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Modal to ask for Event ID (Reusable for Edit and Delete)
const EventIdPopup: React.FC<{ 
  action: "edit" | "delete"; 
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
      <button onClick={() => setIsOpen(true)}>
        {action === "edit" ? "Edit Event" : "Delete Event"}
      </button>

      {isOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>{action === "edit" ? "Enter Event ID to Edit" : "Enter Event ID to Delete"}</h2>
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="Enter Event ID"
            />
            <div>
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple inline CSS for the modal
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

// Admin_loggedin component
export default function Admin_loggedin() {
  const navigate = useNavigate();

  const handleEditSubmit = (eventId: string) => {
    // Redirect to the edit event page using the provided event ID
    navigate(`/admin/update-event/${eventId}`);
  };

  const handleDeleteSubmit = (eventId: string) => {
    navigate(`/admin/delete-event/${eventId}`);
  };

  return (
    <div>
      <h1>Welcome admin!</h1>
      <a href="http://localhost:5097/admin/events">
        <button>See events</button>
      </a>
      <a href="http://localhost:5097/admin/create-event">
        <button>Create event</button>
      </a>
      {/* Edit Event Popup */}
      <EventIdPopup action="edit" onSubmit={handleEditSubmit} />
      {/* Delete Event Popup */}
      <EventIdPopup action="delete" onSubmit={handleDeleteSubmit} />
      <a href="http://localhost:5097/Logout">
        <button>Log out</button>
      </a>
    </div>
  );
}
