import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface Attendance {
  userId: number;
  firstName: string;
  lastName: string;
}

interface Event {
  eventId: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  adminApproval: boolean;
  event_Attendances: Attendance[];
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rating, setRating] = useState<number | null>(null);
  const [userAttending, setUserAttending] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!id) {
          throw new Error("Event ID is missing.");
        }

        const eventResponse = await fetch(`/api/v1/events/${id}`);
        if (!eventResponse.ok) {
          throw new Error("Failed to fetch event details.");
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);

        const userId = 3; // Replace with authenticated user's ID
        const isUserAttending = eventData.event_Attendances.some(
          (attendance: Attendance) => attendance.userId === userId
        );
        setUserAttending(isUserAttending);

        const reviewResponse = await fetch(`/api/v1/events/${id}/review`);
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          setRating(reviewData);
        } else {
          setRating(null);
        }
      } catch (error) {
        console.error("Error fetching event or review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleAttendEvent = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to log in to attend this event.");
      return;
    }

    if (window.confirm("Are you sure you want to attend this event?")) {
      try {
        const response = await fetch("/api/v1/attendance/attend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            UserId: 3, // Replace with authenticated user's ID
            EventId: id,
          }),
        });

        if (!response.ok) {
          if (response.status === 409) {
            alert("You are already registered for this event.");
          } else {
            throw new Error("Failed to attend event.");
          }
        } else {
          const result = await response.json();
          alert("You have successfully registered for the event!");
          setUserAttending(true);
        }
      } catch (error) {
        console.error("Error attending event:", error);
        alert("Error registering for the event.");
      }
    }
  };

  const handleCancelAttendance = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to log in to cancel your attendance.");
      return;
    }

    if (window.confirm("Are you sure you want to cancel your attendance for this event?")) {
      try {
        const response = await fetch(`/api/v1/attendance/cancel/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Your attendance has been canceled.");
          setUserAttending(false);
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Failed to cancel attendance.");
        }
      } catch (error) {
        console.error("Error canceling attendance:", error);
        alert("Error canceling attendance.");
      }
    }
  };

    // styling
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "1rem",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "600px",
      padding: "2rem",
      borderRadius: "8px",
      backgroundColor: "#fff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "1.8rem",
      color: "#202124",
      marginBottom: "1rem",
      textAlign: "center",
    },
    info: {
      fontSize: "1rem",
      color: "#5f6368",
      marginBottom: "0.5rem",
    },
    buttons: {
      display: "flex",
      justifyContent: "space-between",
      gap: "1rem",
      marginTop: "1rem",
    },
    button: {
      padding: "0.8rem 1.5rem",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#4285F4",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textDecoration: "none",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#357ae8",
    },
    backButton: {
      marginTop: "1rem",
      width: "100%",
      textAlign: "center",
      textDecoration: "none",
      fontSize: "1rem",
      color: "#4285F4",
      cursor: "pointer",
    },
    error: {
      color: "red",
      marginTop: "1rem",
      textAlign: "center",
    },
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (!event) {
    return <div style={styles.container}>Event not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{event.title}</h1>
        <p style={styles.info}>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
        <p style={styles.info}>Start Time: {event.startTime}</p>
        <p style={styles.info}>End Time: {event.endTime}</p>
        <p style={styles.info}>Location: {event.location}</p>
        <p style={styles.info}>Description: {event.description}</p>
        <p style={styles.info}>Admin Approved: {event.adminApproval ? "Yes" : "No"}</p>

        <h3 style={styles.title}>Event Rating:</h3>
        {rating !== null ? (
          <p style={styles.info}>Average Rating: {rating.toFixed(1)} / 5</p>
        ) : (
          <p style={styles.info}>No rating available</p>
        )}

        <div style={styles.buttons}>
          <button
            style={styles.button}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor!)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor!)}
            onClick={handleAttendEvent}
          >
            Attend Event
          </button>
          <button
            style={styles.button}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor!)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor!)}
            onClick={handleCancelAttendance}
          >
            Cancel Attendance
          </button>
          <Link to={`/review/${id}`} style={{ textDecoration: "none" }}>
            <button
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor!)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor!)}
            >
              Review Event
            </button>
          </Link>
        </div>
        <a href="/user" style={styles.backButton}>
          Back
        </a>
      </div>
    </div>
  );
};

export default EventDetails;
