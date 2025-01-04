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
    <div>
      <h1>Create Event</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Event Date:</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
      <a href="/admin">
        <button>Back</button>
      </a>
    </div>
  );
};

export default CreateEventForm;
