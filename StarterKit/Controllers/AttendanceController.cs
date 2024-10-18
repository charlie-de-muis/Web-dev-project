using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
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

            // Fetch the user from the database (replace with actual user fetching logic)
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

            // Create a new attendance record
            var attendance = new Attendance
            {
                AttendanceDate = DateTime.UtcNow,
                User = user // Set the user reference directly
            };

            // Add attendance to the database
            await _dbContext.Attendance.AddAsync(attendance);
            await _dbContext.SaveChangesAsync();

            // Return the event details along with attendance confirmation
            return CreatedAtAction(nameof(AttendEvent), new { id = attendance.AttendanceId }, eventToAttend);
        }
    }

    public class AttendanceRequest
    {
        public int UserId { get; set; }
        public int EventId { get; set; }
    }
}
