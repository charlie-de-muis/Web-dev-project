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
        HttpContext.Session.SetBool("IsAdmin", isAdmin); // Store the admin status
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

}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}
