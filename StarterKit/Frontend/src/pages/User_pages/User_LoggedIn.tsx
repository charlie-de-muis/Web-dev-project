import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Event {
  eventId: number;
  title: string;
  eventDate: string; // Date in string format (e.g. "18-10-2026")
  description: string;
}

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5097/api/v1/events"); // Adjust API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data: string[] = await response.json(); // Backend returns an array of strings
        
        // Parse each event string and extract the necessary information
        const parsedEvents = data.map((eventStr) => {
          const eventParts = eventStr.split(" | ");
          
          const eventId = parseInt(eventParts[0].split(": ")[1]);
          const title = eventParts[1].split(": ")[1];
          const eventDate = eventParts[3].split(": ")[1]; // Event date (in DD-MM-YYYY format)
          const description = eventParts[2].split(": ")[1];

          // Convert the date from DD-MM-YYYY to YYYY-MM-DD
          const [day, month, year] = eventDate.split("-");
          const formattedDate = `${year}-${month}-${day}`;

          return {
            eventId,
            title,
            eventDate: formattedDate, // Use the formatted date
            description,
          };
        });

        setEvents(parsedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (id: number) => {
    navigate(`/events/${id}`); // Navigate to the event details page
  };

  return (
    <div>
      <h1>All Events</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.eventId} onClick={() => handleEventClick(event.eventId)}>
                <td>{event.title}</td>
                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td>{event.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No events available</td>
            </tr>
          )}
        </tbody>
      </table>
      <a href="http://localhost:5097/Logout">
        <button>Log out</button>
      </a>
    </div>
  );
};

export default HomePage;
