using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace StarterKit.Controllers;

[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    // LoginController.cs

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginBody loginBody)
    {
        LoginStatus status = await _loginService.CheckPassword(loginBody.Username, loginBody.Password);

        if (status == LoginStatus.IncorrectUsername)
        {
            return Unauthorized("Incorrect username");
        }

        if (status == LoginStatus.IncorrectPassword)
        {
            return Unauthorized("Incorrect password");
        }

        if (status == LoginStatus.Success)
        {
            bool isAdmin = _loginService.IsAdmin(loginBody.Username);

            // Get UserId using the new method
            int? userId = await _loginService.GetUserIdByUsername(loginBody.Username);
            if (userId.HasValue)
            {
                // Set session values
                HttpContext.Session.SetString("Username", loginBody.Username);
                HttpContext.Session.SetInt32("UserId", userId.Value);
                HttpContext.Session.SetBool("IsAdmin", isAdmin);

                // Optionally, create a cookie with the username
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,  // Make cookie HTTPOnly for security
                    Secure = true,    // Only send cookie over HTTPS
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.Now.AddHours(1)  // Expire in 1 hour (or customize as needed)
                };

                Response.Cookies.Append("UserId", userId.ToString(), cookieOptions); // Store UserId in cookie

                return Ok($"Log in successful for {loginBody.Username}");
            }
            else
            {
                return Unauthorized("User ID could not be retrieved.");
            }
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
}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
