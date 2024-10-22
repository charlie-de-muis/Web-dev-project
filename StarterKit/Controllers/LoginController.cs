using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers;
// https://stackoverflow.com/questions/54868207/how-to-create-and-access-session-net-core-api

[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;
    private readonly LoginService _loginService1;

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
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

        if (string.IsNullOrEmpty(username)){return Ok(new {IsLoggedIn = false, Adminusername = (string) null});}
        return Ok(new {IsLoggedIn = true, AdminUsername = username});        
    }

    [HttpGet("Logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok("Logged out");
    }

    // Registration method 1.3
[HttpPost("Register")]
public IActionResult Register([FromBody] RegistrationBody registrationBody)
{
    var registrationResult = _loginService1.RegisterUser(registrationBody.Username, registrationBody.Password, registrationBody.IsAdmin);
    
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

// Checking user role in event endpoint
[HttpPost("CreateEvent")]
public IActionResult CreateEvent([FromBody] EventBody eventBody)
{
    if (!IsAdminLoggedInNow())
        return Unauthorized("Only admins can create events.");

    // Proceed with event creation logic
    return Ok("Event created successfully");
}

[HttpPost("UpdateEvent")]
public IActionResult UpdateEvent([FromBody] EventBody eventBody)
{
    if (!IsAdminLoggedInNow())
        return Unauthorized("Only admins can update events.");

    // Proceed with event update logic
    return Ok("Event updated successfully");
}

[HttpPost("DeleteEvent")]
public IActionResult DeleteEvent([FromBody] EventBody eventBody)
{
    if (!IsAdminLoggedInNow())
        return Unauthorized("Only admins can delete events.");

    // Proceed with event deletion logic
    return Ok("Event deleted successfully");
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
    // Logic to retrieve and return all events
    return Ok("Here are the events");
}

[HttpPost("AttendEvent")]
public IActionResult AttendEvent([FromBody] EventBody eventBody)
{
    // Logic to mark user as attending an event
    return Ok("Event attended successfully");
}
}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}

public class EventBody
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime EventDate { get; set; }
    public string Location { get; set; }
}