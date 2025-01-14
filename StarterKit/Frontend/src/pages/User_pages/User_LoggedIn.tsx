import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Event {
  eventId: number;
  title: string;
  eventDate: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5097/api/v1/events");
        if (!response.ok) throw new Error("Failed to fetch events");

        const data: string[] = await response.json();
        const parsedEvents = data.map((eventStr) => {
          const eventParts = eventStr.split(" | ");
          const eventId = parseInt(eventParts[0].split(": ")[1]);
          const title = eventParts[1].split(": ")[1];
          const eventDate = eventParts[3].split(": ")[1];
          const description = eventParts[2].split(": ")[1];
          const [day, month, year] = eventDate.split("-");
          const formattedDate = `${year}-${month}-${day}`;
          return { eventId, title, eventDate: formattedDate, description };
        });

        setEvents(parsedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const fetchAttendingEvents = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You need to log in to fetch attending events.");
        return;
      }

      const response = await fetch("http://localhost:5097/api/v1/attendance/user/attending-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch attending events.");

      const attendingEventsData: Event[] = await response.json();
      setAttendingEvents(attendingEventsData);
    } catch (error) {
      console.error("Error fetching attending events:", error);
    }
  };

  const handleEventClick = (id: number) => {
    navigate(`/events/${id}`);
  };

  // styling
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      textAlign: "center",
      color: "#202124",
      marginBottom: "2rem",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "2rem",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    th: {
      backgroundColor: "#f8f9fa",
      color: "#5f6368",
      fontWeight: "bold",
      textAlign: "left",
      padding: "1rem",
      borderBottom: "1px solid #ddd",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid #ddd",
    },
    row: {
      cursor: "pointer",
    },
    rowHover: {
      backgroundColor: "#f1f3f4",
    },
    button: {
      display: "block",
      width: "100%",
      maxWidth: "200px",
      margin: "1rem auto",
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
    link: {
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>All Events</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Description</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr
                key={event.eventId}
                style={styles.row}
                onClick={() => handleEventClick(event.eventId)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.rowHover.backgroundColor!)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={styles.td}>{event.title}</td>
                <td style={styles.td}>{new Date(event.eventDate).toLocaleDateString()}</td>
                <td style={styles.td}>{event.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={styles.td}>
                No events available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        style={styles.button}
        onClick={fetchAttendingEvents}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor!)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor!)}
      >
        Show My Attending Events
      </button>

      {attendingEvents.length > 0 && (
        <>
          <h2 style={styles.header}>My Attending Events</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {attendingEvents.map((event) => (
                <tr key={event.eventId}>
                  <td style={styles.td}>{event.title}</td>
                  <td style={styles.td}>{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td style={styles.td}>{event.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <a href="http://localhost:5097/user/workdays" style={styles.link}>
        <button style={styles.button}>Change Workdays</button>
      </a>
      <a href="http://localhost:5097/Logout" style={styles.link}>
        <button style={styles.button}>Log Out</button>
      </a>
    </div>
  );
};

export default HomePage;
