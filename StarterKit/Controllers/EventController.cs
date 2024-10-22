using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Controllers;

[ApiController]
[Route("api/v1/Events")]
public class EventController : Controller
{
    // bring in the database
    private readonly DatabaseContext _context;
    public EventController(DatabaseContext context)
    {
        _context = context;
    }

    // The Read operation needs to be a GET endpoint and must be public.
    // This endpoint will also be used by the front-end to display an overview of events. 
    [HttpGet]
    public async Task<ActionResult<IEnumerable<string>>> GetEvents()
    {
        // Include the reviews and attendees to the event entity in the response of the GET operation.
        List<Event> events = _context.Event.ToList();
        List<string> txts = new List<string>();

        foreach (Event e in events)
        {
            string txt = $"Event ID: {e.EventId}  " +
                        $"Event name: {e.Title}  " +
                        $"Description: {e.Description}  " +
                        $"Date: {e.EventDate}  " +
                    $"Attendances: {(e.Event_Attendances != null ? e.Event_Attendances.Select(a => a.User.FirstName + " " + a.User.LastName).ToList() : new List<string>())}  " +
                    $"Reviews: {(e.Event_Attendances != null ? e.Event_Attendances.Select(a => a.Feedback).ToList() : new List<string>())}";
            
            txts.Add(txt);
        }
        return Ok(txts);
    }
    

    [HttpPut("create")]
    public async Task<ActionResult<Event>> CreateEvent([FromBody] Event? eventItem)
    {
        if (!HttpContext.Session.GetBool("IsAdmin")) return Unauthorized("Only admins");
        if (eventItem == null){return NotFound("Event item not found");}
        // Add the event to the database context
        await _context.Event.AddAsync(eventItem);
        
        // Save the changes to the database
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEvents), new { id = eventItem.EventId }, eventItem);
    }


    [HttpPost("update/{id}")]
    public async Task<ActionResult<Event>> UpdateEvent([FromRoute] int id, [FromBody] Event new_event)
    {
        if (!HttpContext.Session.GetBool("IsAdmin")) return Unauthorized("Only admins");
        Event? ThisEvent = await _context.Event.FirstOrDefaultAsync(e => e.EventId == id);

        if (ThisEvent == null){return NotFound($"Event with ID: {id} not found");}
        
        ThisEvent.Title = new_event.Title;
        ThisEvent.Description = new_event.Description;
        ThisEvent.EventDate = new_event.EventDate;
        ThisEvent.StartTime = new_event.StartTime;
        ThisEvent.EndTime = new_event.EndTime;
        ThisEvent.Location = new_event.Location;
        ThisEvent.Event_Attendances = new_event.Event_Attendances;

        await _context.SaveChangesAsync();
        return Ok(await _context.Event.FirstOrDefaultAsync(e => e.EventId == id));
    }

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteEvent([FromRoute] int id)
    {
        if (!HttpContext.Session.GetBool("IsAdmin")) return Unauthorized("Only admins");
        Event? delEvent = await _context.Event.FirstOrDefaultAsync(e => e.EventId == id);
        if (delEvent == null){return NotFound($"Event with ID: {id} not found");}

        _context.Event.Remove(delEvent);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("StarReview/{id}")]
    public async Task<IActionResult> StarReview([FromBody] ReviewMap reviewmap)
    {
        if (reviewmap != null && reviewmap.Review != null && reviewmap.Stars > 0)
    {
        return Ok($"{reviewmap.Stars} Stars: {reviewmap.Review}");
    }
        else
        {
            return BadRequest("No review found.");
        }
    }
    public class ReviewMap
    {
        public int Stars { get; set; }
        public string Review { get; set; }
    }

}