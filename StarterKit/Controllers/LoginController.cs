using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers;

[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;
    private readonly EventController _eventController;

    public LoginController(ILoginService loginService, EventController eventController)
    {
        _loginService = loginService;
        _eventController = eventController;
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginBody loginBody)
    {
        LoginStatus status = _loginService.CheckPassword(loginBody.Username, loginBody.Password);

        if (status == LoginStatus.IncorrectUsername) return Unauthorized("Incorrect username");
        if (status == LoginStatus.IncorrectPassword) return Unauthorized("Incorrect password");

        if (status == LoginStatus.Success)
        {
            bool isAdmin = _loginService.IsAdmin(loginBody.Username);
            HttpContext.Session.SetString("Username", loginBody.Username);
            HttpContext.Session.SetString("IsAdmin", isAdmin.ToString()); // Convert bool to string
            return Ok($"Log in successful for {loginBody.Username}");
        }

        return Unauthorized("Unknown error");
    }

    [HttpGet("IsAdminLoggedIn")]
    public IActionResult IsAdminLoggedIn()
    {
        var username = HttpContext.Session.GetString("Username");

        if (string.IsNullOrEmpty(username)) 
            return Ok(new { IsLoggedIn = false, AdminUsername = (string)null });

        return Ok(new { IsLoggedIn = true, AdminUsername = username });
    }

    [HttpGet("Logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok("Logged out");
    }

    [HttpPost("Register")]
    public IActionResult Register([FromBody] RegistrationBody registrationBody)
    {
        var registrationResult = _loginService.RegisterUser(registrationBody.Username, registrationBody.Password, registrationBody.IsAdmin);

        if (registrationResult == RegistrationStatus.UserAlreadyExists)
            return Conflict("Username already taken");

        return Ok("User registered successfully");
    }

    public class RegistrationBody
    {
        public string? Username { get; set; }
        public string? Password { get; set; }
        public bool IsAdmin { get; set; }
    }

    private bool IsAdminLoggedInNow()
    {
        var isAdminStr = HttpContext.Session.GetString("IsAdmin");
        return isAdminStr != null && bool.Parse(isAdminStr); // Convert string back to bool
    }

    // Refine Event Access for Regular Users
    [HttpGet("ViewEvents")]
    public IActionResult ViewEvents()
    {
        var result = _eventController.GetEvents().Result; // Call to EventController
        return Ok(result);
    }

    [HttpPost("AttendEvent")]
    public IActionResult AttendEvent([FromBody] EventBody eventBody)
    {
        var username = HttpContext.Session.GetString("Username");
        if (string.IsNullOrEmpty(username))
            return Unauthorized("You need to be logged in to attend an event.");

        var result = _eventController.MarkUserAttendance(username, eventBody.Id).Result; // Assume you have this method in EventController
        if (result)
            return Ok("Event attended successfully");

        return BadRequest("Failed to mark attendance.");
    }
}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
