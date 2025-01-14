import React, { useEffect, useState } from "react";

interface Event {
  eventId: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5097/api/v1/events");
        if (response.ok) {
          const data: string[] = await response.json();
          const parsedEvents = data.map((eventText) => {
            // Parse each event string into an object
            const eventDetails = eventText.split(" | ").reduce((acc: any, part: string) => {
              const [key, value] = part.split(": ");
              acc[key.trim().toLowerCase().replace(" ", "")] = value;
              return acc;
            }, {});

            return {
              eventId: parseInt(eventDetails.eventid),
              title: eventDetails.title,
              description: eventDetails.description,
              eventDate: eventDetails.date,
              startTime: eventDetails.starttime,
              endTime: eventDetails.endtime,
              location: eventDetails.location,
              attendees: eventDetails.attendees,
            };
          });
          setEvents(parsedEvents);
        } else {
          setError("Failed to load events.");
        }
      } catch (err) {
        setError("Error fetching events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>All Events</h1>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.eventId}>
                <td>{event.eventId}</td>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{event.eventDate}</td>
                <td>{event.startTime}</td>
                <td>{event.endTime}</td>
                <td>{event.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.backButtonContainer}>
        <a href="/admin" style={styles.backButton}>
          <button style={styles.backButton}>Back</button>
        </a>
      </div>
    </div>
  );
};

// Google-inspired CSS
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "Roboto, sans-serif",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    color: "#202124",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  card: {
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "10px",
    backgroundColor: "#f1f3f4",
    fontWeight: 500,
    color: "#5f6368",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  backButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#4285F4", // Google Blue
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  backButtonHover: {
    backgroundColor: "#357ae8", // Darker Google Blue for hover effect
  },
};

export default Events;
