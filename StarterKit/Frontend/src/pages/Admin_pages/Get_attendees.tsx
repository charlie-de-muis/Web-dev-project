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
    <div>
      <h1>Attendees List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : attendees.length === 0 ? (
        <p>No attendees found for this event.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Feedback</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.userId}>
                <td>{attendee.userId}</td>
                <td>{attendee.firstName}</td>
                <td>{attendee.lastName}</td>
                <td>{attendee.feedback}</td>
                <td>{attendee.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <a href="/admin">
        <button>Back</button>
      </a>
    </div>
  );
};

export default AttendeesList;
