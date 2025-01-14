import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Attendee {
  userId: number;
  firstName: string;
  lastName: string;
  feedback: string;
  rating: number;
}

const AttendeesList: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>(); // Get event ID from URL
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Event ID from URL:", eventId); // Log eventId to check if it's correct
    if (eventId) {
      fetchAttendees(eventId);
    } else {
      setError("No event ID provided.");
      setLoading(false);
    }
  }, [eventId]); // Dependency on eventId to trigger when it changes

  const fetchAttendees = async (eventId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5097/api/v1/attendance/event/${eventId}/attendees`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data); // Log the response to verify structure

        // Directly use the response data as attendees
        if (Array.isArray(data) && data.length > 0) {
          setAttendees(data);
        } else {
          setError("No attendees found for this event.");
        }
      } else {
        setError("Failed to fetch attendees.");
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
      setError("An error occurred while fetching attendees.");
    } finally {
      setLoading(false); // Stop loading after the fetch attempt
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Attendees List</h1>

      {loading ? (
        <p style={styles.loadingText}>Loading...</p>
      ) : error ? (
        <p style={styles.errorText}>{error}</p>
      ) : attendees.length === 0 ? (
        <p style={styles.infoText}>No attendees found for this event.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>First Name</th>
              <th style={styles.th}>Last Name</th>
              <th style={styles.th}>Feedback</th>
              <th style={styles.th}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.userId}>
                <td style={styles.td}>{attendee.userId}</td>
                <td style={styles.td}>{attendee.firstName}</td>
                <td style={styles.td}>{attendee.lastName}</td>
                <td style={styles.td}>{attendee.feedback}</td>
                <td style={styles.td}>{attendee.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={styles.backButtonContainer}>
        <a href="/admin">
          <button style={styles.backButton}>Back</button>
        </a>
      </div>
    </div>
  );
};

// Google-like styling
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
  loadingText: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#5f6368",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: "1.2rem",
  },
  infoText: {
    textAlign: "center",
    color: "#5f6368",
    fontSize: "1.2rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    marginTop: "20px",
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

export default AttendeesList;
