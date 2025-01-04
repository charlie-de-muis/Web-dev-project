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
  const [successMessage, setSuccessMessage] = useState<string>("");

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
          method: "PUT", // Put method to update
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
    <div>
      <h1>Edit Event</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Title:</label>
          <input
            type="text"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Event Date:</label>
          <input
            type="date"
            value={eventData.eventDate}
            onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="time"
            value={eventData.endTime}
            onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            required
          />
        </div>
        <button type="submit">Update Event</button>
      </form>
      <a href="/admin">
        <button>Back</button>
      </a>
    </div>
  );
};

export default EditEventForm;
