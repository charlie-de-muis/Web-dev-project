using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using System.Linq;
using System.Threading.Tasks;

namespace StarterKit.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendanceController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public AttendanceController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

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
            var eventToAttend = await _dbContext.Event.FindAsync(request.EventId);
            if (eventToAttend == null)
            {
                return NotFound("Event not found.");
            }

            // Check for availability of the event based on date and start time
            var eventDate = eventToAttend.EventDate.ToDateTime(TimeOnly.MinValue);
            var startTime = TimeOnly.FromTimeSpan(eventToAttend.StartTime);

            // Check if the user is already registered for the event
            var existingAttendance = await _dbContext.Event_Attendance
                .Where(ea => ea.User.UserId == request.UserId && ea.Event.EventId == request.EventId)
                .FirstOrDefaultAsync();

            if (existingAttendance != null)
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
            await _dbContext.SaveChangesAsync();

            // Return the event details along with the attendance confirmation
            return CreatedAtAction(nameof(AttendEvent), new { id = eventAttendance.Event_AttendanceId }, eventToAttend);
        }

        // New GET endpoint to retrieve the list of attendees for a specific event
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

        // New DELETE endpoint to allow a user to cancel their attendance
        [HttpDelete]
        [Route("cancel/{eventId}")]
        public async Task<IActionResult> CancelAttendance(int eventId)
        {
            // Check if the user is logged in
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            // Fetch the user (replace with your actual user fetching logic)
            var userId = int.Parse(User.FindFirst("UserId").Value);
            var user = await _dbContext.User.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Find the attendance record for the specified event
            var attendanceToDelete = await _dbContext.Event_Attendance
                .FirstOrDefaultAsync(ea => ea.User.UserId == userId && ea.Event.EventId == eventId);

            if (attendanceToDelete == null)
            {
                return NotFound("Attendance record not found.");
            }

            // Remove the attendance record from the database
            _dbContext.Event_Attendance.Remove(attendanceToDelete);
            await _dbContext.SaveChangesAsync();

            return NoContent(); // Return 204 No Content on successful deletion
        }
    }

    public class AttendanceRequest
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
    }
}
