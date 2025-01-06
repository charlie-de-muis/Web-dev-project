using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace StarterKit.Controllers;

[ApiController]
[Route("api/v1/attendance")]
public class AttendanceController : ControllerBase
{
    private readonly DatabaseContext _dbContext;

    public AttendanceController(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
    }

    [Authorize]
    [HttpPost]
    [Route("attend")]
    public async Task<IActionResult> AttendEvent([FromBody] AttendanceRequest request)
    {
        // Validate the request
        if (request == null || request.UserId <= 0 || request.EventId <= 0)
        {
            return BadRequest("Invalid request data.");
        }

        // Check if the user is logged in
        if (!User.Identity.IsAuthenticated)
        {
            return Unauthorized();
        }

        // Fetch the user from the database
        var user = await _dbContext.User.FindAsync(request.UserId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // Fetch the event from the database
        var eventToAttend = await _dbContext.Event.Include(e => e.Event_Attendances).FirstOrDefaultAsync( e=> e.EventId == request.EventId);
        if (eventToAttend == null)
        {
            return NotFound("Event not found.");
        }

        foreach (var e in user.Event_Attendances ?? new List<Event_Attendance>())  // Null check for Event_Attendances
        {
            if (e.Event != null && e.Event.EventDate == eventToAttend.EventDate)  // Null check for Event
            {
                bool isOverlapping = e.Event.StartTime < eventToAttend.EndTime && e.Event.EndTime > eventToAttend.StartTime;
                
                if (isOverlapping)
                {
                    return Conflict("The user is already registered for an event at this time.");
                }
            }
        }

        // Check for availability of the event based on date and start time
        var eventDate = eventToAttend.EventDate.ToDateTime(TimeOnly.MinValue);
        var startTime = TimeOnly.FromTimeSpan(eventToAttend.StartTime);

        // Check if the user is already registered for the event
        var existingAttendance = await _dbContext.Event_Attendance
            .Where(ea => ea.User.UserId == request.UserId && ea.Event.EventId == request.EventId)
            .FirstOrDefaultAsync();

        if (existingAttendance!= null)
        {
            return Conflict("The user is already registered for this event.");
        }

        // Create a new Event_Attendance record
        var eventAttendance = new Event_Attendance
        {
            User = user,
            Event = eventToAttend,
            Feedback = string.Empty, // Optional: Initialize feedback if not provided
            Rating = 0, // Optional: Set default rating
        };

        // Add the Event_Attendance to the database
        await _dbContext.Event_Attendance.AddAsync(eventAttendance);
        await _dbContext.Attendance.AddAsync(new Attendance{AttendanceDate = eventAttendance.Event.EventDate.ToDateTime(TimeOnly.FromTimeSpan(eventAttendance.Event.StartTime)), User = user});
        eventToAttend.Event_Attendances.Add(eventAttendance);
        user.Event_Attendances.Add(eventAttendance);

        await _dbContext.SaveChangesAsync();

        // Return the event details along with the attendance confirmation
        return CreatedAtAction(nameof(AttendEvent), new { id = eventAttendance.Event_AttendanceId }, eventToAttend);
    }

    // New GET endpoint to retrieve the list of attendees for a specific event
    [Authorize]
    [HttpGet]
    [Route("event/{eventId}/attendees")]
    public async Task<IActionResult> GetAttendees(int eventId)
    {
        // Check if the user is logged in
        if (!User.Identity.IsAuthenticated)
        {
            return Unauthorized();
        }

        // Fetch the event from the database
        var eventToCheck = await _dbContext.Event
            .Include(e => e.Event_Attendances)
                .ThenInclude(ea => ea.User) // Include User information for each attendance
            .FirstOrDefaultAsync(e => e.EventId == eventId);

        if (eventToCheck == null)
        {
            return NotFound("Event not found.");
        }

        // Get the list of attendees
        var attendees = eventToCheck.Event_Attendances
            .Select(ea => new
            {
                ea.User.UserId,
                ea.User.FirstName,
                ea.User.LastName,
                ea.Feedback,
                ea.Rating
            })
            .ToList();

        return Ok(attendees);
    }

    [Authorize]
    [HttpDelete]
    [Route("cancel/{eventId}")]
    public async Task<IActionResult> CancelAttendance(int eventId)
    {
        // Check if the user is logged in
        if (!User.Identity.IsAuthenticated)
        {
            return Unauthorized();
        }

        // Get the UserId from the claims
        var userIdClaim = User.FindFirst("UserId");
        if (userIdClaim == null)
        {
            return Unauthorized("User ID claim not found.");
        }

        var userId = int.Parse(userIdClaim.Value);

        // Fetch the attendance record for the specified event
        var attendanceToDelete = await _dbContext.Event_Attendance
            .FirstOrDefaultAsync(ea => ea.User.UserId == userId && ea.Event.EventId == eventId);

        // Check if the attendance record exists
        if (attendanceToDelete == null)
        {
            return NotFound("Attendance record not found.");
        }

        // Remove the attendance record from the database
        _dbContext.Event_Attendance.Remove(attendanceToDelete);
        await _dbContext.SaveChangesAsync();

        return Ok("Attendance cancelled"); // Return Ok on successful deletion
    }

    // Workdays API

    [HttpPost("workdays")]
    public async Task<IActionResult> Change_attendance([FromBody] WorkdaysRequest request)
    {
        // Check if the user is authenticated by verifying session/cookie
        var userId = HttpContext.Session.GetInt32("UserId");

        if (!userId.HasValue)
        {
            return Unauthorized("No user found in session");
        }

        var user = await _dbContext.User.FirstOrDefaultAsync(u => u.UserId == userId.Value);
        if (user == null)
        {
            return BadRequest("No user found");
        }

        user.RecuringDays = request.NewDays;

        await _dbContext.SaveChangesAsync();

        return Ok("Workdays updated.");
    }

    
    [Authorize]
    [HttpPost]
    [Route("event/{eventId}/review")]
    public async Task<IActionResult> LeaveReview(int eventId, [FromBody] ReviewRequest review)
    {
        // Validate input
        if (review == null || review.Rating < 1 || review.Rating > 5 || string.IsNullOrWhiteSpace(review.Feedback))
        {
            return BadRequest("Invalid review data.");
        }

        // Get the UserId from the claims
        var userIdClaim = User.FindFirst("UserId");
        if (userIdClaim == null)
        {
            return Unauthorized("User ID claim not found.");
        }

        var userId = int.Parse(userIdClaim.Value);

        // Fetch the attendance record
        var attendance = await _dbContext.Event_Attendance
            .FirstOrDefaultAsync(ea => ea.Event.EventId == eventId && ea.User.UserId == userId);

        if (attendance == null)
        {
            return NotFound("You are not registered for this event.");
        }

        // Update the attendance record with the review
        attendance.Rating = review.Rating;
        attendance.Feedback = review.Feedback;

        await _dbContext.SaveChangesAsync();

        return Ok("Review submitted successfully.");
    }

    public class ReviewRequest
    {
        public int Rating { get; set; }
        public string Feedback { get; set; }
    }



    public class AttendanceRequest
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
    }
}

    public class WorkdaysRequest
    {
        public string NewDays { get; set; }
    }
