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
    <div>
      <h1>All events</h1>
      <table>
        <thead>
          <tr>
            <th>Event ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Location</th>
            <th>Attendees</th>
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
              <td>{event.attendees}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/admin">
        <button>Back</button>
      </a>
    </div>
  );
};

export default Events;
