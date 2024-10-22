using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers;

[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginBody loginBody)
    {
        LoginStatus status = await _loginService.CheckPassword(loginBody.Username, loginBody.Password);

        if (status == LoginStatus.IncorrectUsername) return Unauthorized("Incorrect username");
        if (status == LoginStatus.IncorrectPassword) return Unauthorized("Incorrect password");

        if (status == LoginStatus.Success)
        {
            bool isAdmin = _loginService.IsAdmin(loginBody.Username);
            HttpContext.Session.SetBool("IsAdmin", isAdmin); // Use SetBool here
            HttpContext.Session.SetString("Username", loginBody.Username);
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

        // Retrieve the admin status from the session
        bool isAdmin = HttpContext.Session.GetBool("IsAdmin");
        
        return Ok(new { IsLoggedIn = true, IsAdmin = isAdmin, AdminUsername = username });
    }

    [HttpGet("Logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok("Logged out");
    }

// WEEK 1.3

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] User registrationBody)
    {
        var registrationResult = await _loginService.RegisterUser(registrationBody);

        if (registrationResult == null)
        {return BadRequest("User already exists");}

        return Ok("User registered successfully");
    }



    // [HttpPost("AttendEvent")]
    // public IActionResult AttendEvent([FromBody] EventBody eventBody)
    // {
    //     var username = HttpContext.Session.GetString("Username");
    //     if (string.IsNullOrEmpty(username))
    //         return Unauthorized("You need to be logged in to attend an event.");

    //     var result = _eventController.MarkUserAttendance(username, eventBody.Id).Result; // Assume you have this method in EventController
    //     if (result)
    //         return Ok("Event attended successfully");

    //     return BadRequest("Failed to mark attendance.");
    // }
}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
