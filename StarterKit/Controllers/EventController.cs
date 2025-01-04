using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Controllers;

[ApiController]
[Route("api/v1/Events")]
public class EventController : Controller
{
    private readonly DatabaseContext _context;
    private readonly Dictionary<int, List<string>> _eventAttendance = new Dictionary<int, List<string>>();
    private readonly List<Event> _events = new List<Event>();
    public EventController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<string>>> GetEvents()
    {
        List<Event> events = await _context.Event.ToListAsync();
        List<string> eventStrings = new List<string>();

        foreach (var e in events)
        {
            string eventText = $"Event ID: {e.EventId} | " +
                            $"Title: {e.Title} | " +
                            $"Description: {e.Description} | " +
                            $"Date: {e.EventDate} | " +
                            $"Start Time: {e.StartTime} | " +
                            $"End Time: {e.EndTime} | " +
                            $"Location: {e.Location} | " +
                            $"Attendees: {(e.Event_Attendances != null ? string.Join(", ", e.Event_Attendances.Select(a => a.User.FirstName + " " + a.User.LastName)) : "No attendees")}";

            eventStrings.Add(eventText);
        }

        return Ok(eventStrings);
    }

    [HttpPost("create")]
    public async Task<ActionResult<Event>> CreateEventNow([FromBody] Event eventItem)
    {
        // Check if the user is an admin by retrieving the boolean value from the session
        bool isAdmin = HttpContext.Session.GetBool("IsAdmin");

        if (!isAdmin) // If not an admin, return unauthorized
            return Unauthorized("Only admins can create events.");

        await _context.Event.AddAsync(eventItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEvents), new { id = eventItem.EventId }, eventItem);
    }

    [HttpPut("update/{id}")]
    public async Task<ActionResult<Event>> UpdateEventNow([FromRoute] int id, [FromBody] Event new_event)
    {
        // Check if the user is an admin by retrieving the boolean value from the session
        bool isAdmin = HttpContext.Session.GetBool("IsAdmin");

        if (!isAdmin) // If not an admin, return unauthorized
            return Unauthorized("Only admins can create events.");

        var ThisEvent = await _context.Event.FirstOrDefaultAsync(e => e.EventId == id);

        if (ThisEvent == null) return NotFound($"Event with ID: {id} not found");

        ThisEvent.Title = new_event.Title;
        ThisEvent.Description = new_event.Description;
        ThisEvent.EventDate = new_event.EventDate;
        ThisEvent.StartTime = new_event.StartTime;
        ThisEvent.EndTime = new_event.EndTime;
        ThisEvent.Location = new_event.Location;
        ThisEvent.Event_Attendances = new_event.Event_Attendances;
        if (new_event.Event_Attendances is null){new_event.Event_Attendances = new List<Event_Attendance>();}

        await _context.SaveChangesAsync();
        return Ok(ThisEvent);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteEventNow([FromRoute] int id)
    {
        // Check if the user is an admin by retrieving the boolean value from the session
        bool isAdmin = HttpContext.Session.GetBool("IsAdmin");

        if (!isAdmin) // If not an admin, return unauthorized
            return Unauthorized("Only admins can create events.");

        var delEvent = await _context.Event.FirstOrDefaultAsync(e => e.EventId == id);
        if (delEvent == null) return NotFound($"Event with ID: {id} not found");

        _context.Event.Remove(delEvent);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Event deleted successfully" });
    }

    public bool MarkUserAttendance(string username, int eventId)
        {
            var eventToAttend = _events.FirstOrDefault(e => e.EventId == eventId);
            if (eventToAttend == null)
            {
                return false; // Event not found
            }

            // Check if this event already has attendees
            if (!_eventAttendance.ContainsKey(eventId))
            {
                _eventAttendance[eventId] = new List<string>(); // Initialize the attendee list if it doesn't exist
            }

            // Add the user to the list of attendees if they are not already attending
            if (!_eventAttendance[eventId].Contains(username))
            {
                _eventAttendance[eventId].Add(username);
            }

            return true;
        }

        // Optionally, add a method to get the list of attendees for a specific event
        public List<string> GetEventAttendees(int eventId)
        {
            if (_eventAttendance.ContainsKey(eventId))
            {
                return _eventAttendance[eventId];
            }

            return new List<string>(); // No attendees if the event doesn't exist or has no attendees
        }

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetEventById(int id)
    {
        var eventItem = await _context.Event.FirstOrDefaultAsync(e => e.EventId == id);

        if (eventItem == null)
        {
            return NotFound($"Event with ID {id} not found");
        }

        return Ok(eventItem);
}

}
