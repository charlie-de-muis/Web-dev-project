using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace StarterKit.Controllers
{
    [ApiController]
    [Route("api/v1/officeattendance")]
    public class OfficeAttendanceController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;
        private readonly ILoginService _loginService;

        public OfficeAttendanceController(DatabaseContext dbContext, ILoginService loginService)
        {
            _dbContext = dbContext;
            _loginService = loginService;
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateAttendance([FromBody] UpdateAttendanceRequest request)
        {
            // Check if the user is authenticated
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("User is not logged in.");
            }

            // Get the UserId from the claims
            var userIdClaim = User.FindFirst("UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            int userId = int.Parse(userIdClaim.Value);

            // Fetch the attendance record for the current user
            var existingAttendance = await _dbContext.Event_Attendance
                .FirstOrDefaultAsync(ea => ea.User.UserId == userId && ea.Event.EventId == request.CurrentEventId);

            if (existingAttendance == null)
            {
                return NotFound("Attendance record not found.");
            }

            // Fetch the new event to move the attendance to
            var newEvent = await _dbContext.Event.FirstOrDefaultAsync(e => e.EventId == request.NewEventId);
            if (newEvent == null)
            {
                return NotFound("The new event was not found.");
            }

            // Update the existing attendance to the new event
            existingAttendance.Event = newEvent;

            // Save the changes in the database
            await _dbContext.SaveChangesAsync();

            return Ok("Attendance updated successfully.");
        }
    }

    // Request model for updating attendance
    public class UpdateAttendanceRequest
    {
        public int CurrentEventId { get; set; }
        public int NewEventId { get; set; }
    }
}
