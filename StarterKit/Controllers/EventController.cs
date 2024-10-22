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
    private readonly List<EventBody> _events = new List<EventBody>();
    public EventController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<string>>> GetEvents()
    {
        List<Event> events = await _context.Event.ToListAsync();
        List<string> txts = new List<string>();

        foreach (Event e in events)
        {
            string txt = $"Event ID: {e.EventId}  " +
                        $"Event name: {e.Title}  " +
                        $"Description: {e.Description}  " +
                        $"Date: {e.EventDate}  " +
                        $"Attendances: {(e.Event_Attendances != null ? string.Join(", ", e.Event_Attendances.Select(a => a.User.FirstName + " " + a.User.LastName)) : "")}  " +
                        $"Reviews: {(e.Event_Attendances != null ? string.Join(", ", e.Event_Attendances.Select(a => a.Feedback)) : "")}";

            txts.Add(txt);
        }
        return Ok(txts);
    }

    [HttpPut("create")]
    public async Task<ActionResult<Event>> CreateEvent([FromBody] Event eventItem)
    {
        // Check if the user is an admin by retrieving the boolean value from the session
        bool isAdmin = HttpContext.Session.GetBool("IsAdmin");
        
        if (!isAdmin) // If not an admin, return unauthorized
            return Unauthorized("Only admins can create events.");

        await _context.Event.AddAsync(eventItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEvents), new { id = eventItem.EventId }, eventItem);
    }

    [HttpPost("update/{id}")]
    public async Task<ActionResult<Event>> UpdateEvent([FromRoute] int id, [FromBody] Event new_event)
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

        await _context.SaveChangesAsync();
        return Ok(ThisEvent);
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteEvent([FromRoute] int id)
    {
        // Check if the user is an admin by retrieving the boolean value from the session
        bool isAdmin = HttpContext.Session.GetBool("IsAdmin");
        
        if (!isAdmin) // If not an admin, return unauthorized
            return Unauthorized("Only admins can create events.");

        var delEvent = await _context.Event.FirstOrDefaultAsync(e => e.EventId == id);
        if (delEvent == null) return NotFound($"Event with ID: {id} not found");

        _context.Event.Remove(delEvent);
        await _context.SaveChangesAsync();
        return Ok();
    }
}

public class EventBody
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime EventDate { get; set; }
    public string Location { get; set; }
}