using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;

namespace StarterKit.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    // bring in the database
    private readonly DatabaseContext _context;
    public AdminController(DatabaseContext context)
    {
        _context = context;
    }

    // The Read operation needs to be a GET endpoint and must be public.
    // This endpoint will also be used by the front-end to display an overview of events. 
    [HttpGet("events")]
    //[AllowAnonymous] ??
    public Task<ActionResult<IEnumerable<Event>>> GetEvents()
    {

    // Include the reviews and attendees to the event entity in the response of the GET operation.
    var events = /*???*/ ;

    return Ok(events);
    }
    


    [HttpPost("events")]
    
    [Authorize(Roles = "Admin")] // only authorized by admins
    public async Task<ActionResult<Event>> CreateEvent([FromBody] Event eventItem)
    {
        // Add the event to the database context
        await _context.Event.AddAsync(eventItem);
        
        // Save the changes to the database
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEvents), new { id = eventItem.EventId }, eventItem);
    }


    [HttpPut("events/{id}")]
    
    [Authorize(Roles = "Admin")] // only authorized by admins
    public Task<IActionResult> // finish line
    {
        //(...)
    }

    [HttpDelete("events/{id}")]
    
    [Authorize(Roles = "Admin")] // only authorized by admins
    public Task<IActionResult> // finish line
    {
        //(...)
    }
}