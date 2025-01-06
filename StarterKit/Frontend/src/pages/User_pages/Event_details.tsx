import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link from react-router-dom

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
  event_Attendances: Attendance[]; // Use the Attendance type here
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the 'id' parameter from the URL
  const [event, setEvent] = useState<Event | null>(null); // State to store event data
  const [loading, setLoading] = useState<boolean>(true); // Loading state for the component
  const [rating, setRating] = useState<number | null>(null); // State to store the rating
  const [userAttending, setUserAttending] = useState<boolean>(false); // State to check if user is attending

  // Fetch event data and review (Rating) data
  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        console.log("Fetching event with ID:", id); // Log to check if the 'id' is correct
        try {
          // Fetch event details
          const eventResponse = await fetch(`/api/v1/events/${id}`);
          if (!eventResponse.ok) {
            throw new Error("Failed to fetch event");
          }
          const eventData = await eventResponse.json();
          console.log("Fetched event data:", eventData); // Log the event data

          setEvent(eventData);

          // Check if the user is attending this event
          const userId = 3; // Replace with actual user ID from authentication context
          const isUserAttending = eventData.event_Attendances.some(
            (attendance: Attendance) => attendance.userId === userId
          );
          setUserAttending(isUserAttending);

          // Fetch the rating (review) for the event
          const reviewResponse = await fetch(`/api/v1/events/${id}/review`);
          if (!reviewResponse.ok) {
            throw new Error("Failed to fetch review data");
          }
          const reviewData = await reviewResponse.json();
          console.log("Fetched review data:", reviewData); // Log the review data

          setRating(reviewData?.rating || null); // Set the rating state if available
          setLoading(false);
        } catch (error) {
          console.error("Error fetching event or review:", error);
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [id]);

  // Function to handle attending the event
  const handleAttendEvent = async () => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

    if (!token) {
      alert("You need to log in to attend this event.");
      return;
    }

    if (window.confirm("Are you sure you want to attend this event?")) {
      try {
        const userId = 3; // Assume logged-in user's ID. In a real app, you'd fetch this from user context/authentication

        const response = await fetch("/api/v1/attendance/attend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
          body: JSON.stringify({
            UserId: userId,
            EventId: id,
          }),
        });

        if (!response.ok) {
          if (response.status === 409) {
            alert("You are already registered for this event.");
          } else {
            throw new Error("Failed to attend event");
          }
        } else {
          const result = await response.json();
          console.log("Successfully attended the event:", result);
          alert("You have successfully registered for the event!");
          setUserAttending(true); // Mark user as attending
        }
      } catch (error) {
        console.error("Error attending event:", error);
        alert("There was an error while trying to attend the event.");
      }
    }
  };

  // Function to handle canceling attendance
  const handleCancelAttendance = async () => {
    const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

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
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });

        if (response.ok) {
          alert("Your attendance has been canceled.");
          setUserAttending(false); // Mark user as not attending
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Failed to cancel attendance.");
        }
      } catch (error) {
        console.error("Error canceling attendance:", error);
        alert("There was an error while trying to cancel attendance.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("Event state:", event); // Check the event data state

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
      <p>Start Time: {event.startTime}</p>
      <p>End Time: {event.endTime}</p>
      <p>Location: {event.location}</p>
      <p>Description: {event.description}</p>
      <p>Admin Approved: {event.adminApproval ? "Yes" : "No"}</p>

      {/* Display the Rating */}
      <h3>Event Rating:</h3>
      {rating !== null ? (
        <p>Rating: {rating} / 5</p>
      ) : (
        <p>No rating available</p>
      )}

      <h3>Attendees:</h3>
      <ul>
        {event.event_Attendances.length > 0 ? (
          event.event_Attendances.map((attendance, index) => (
            <li key={index}>
              {attendance.firstName} {attendance.lastName}
            </li>
          ))
        ) : (
          <p>No attendees yet</p>
        )}
      </ul>

      {/* Both buttons are displayed here */}
      <button onClick={handleAttendEvent}>Attend event</button>
      <button onClick={handleCancelAttendance}>Cancel Attendance</button>

      {/* Link to the Review form, passing the eventId in the URL */}
      <Link to={`/review/${id}`}>
        <button>Review event</button>
      </Link>

      {/* Back button */}
      <a href="/user">
        <button>Back</button>
      </a>
    </div>
  );
};

export default EventDetails;
