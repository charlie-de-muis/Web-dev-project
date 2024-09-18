using System.Text;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;

namespace StarterKit.Controllers;


[Route("api/v1/Login")]
public class LoginController : Controller
{
    private readonly ILoginService _loginService;
    
    private string AUTH_SESSION_KEY  = "adminlogin";

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("Login")]
    public IActionResult Login([FromBody] LoginBody loginBody)
    {
        // check if were loggedin
        if (!string.IsNullOrEmpty(HttpContext.Session.GetString(AUTH_SESSION_KEY)))
        {
            return Json(new LoginResponseBody
            {
                User = HttpContext.Session.GetString(AUTH_SESSION_KEY),
                IsLoggedIn = true
            });
        }

        // check if password is correct
        if (loginBody.Username == "admin" && loginBody.Password == "admin");
        {
            HttpContext.Session.SetString(AUTH_SESSION_KEY, loginBody.Username);
            {
                return Json(new LoginResponseBody{
                User = HttpContext.Session.GetString(AUTH_SESSION_KEY),
                IsLoggedIn = true
                });
            }
            // return RedirectPermanent("...");
        }

        // TODO: Impelement login method
        // [ViewData]"message" = "Password or username incorrect";
        // return View("Login");
        //return Unauthorized("Incorrect password");
    }

    [HttpGet("IsAdminLoggedIn")]
    public IActionResult IsAdminLoggedIn()
    {
        // TODO: This method should return a status 200 OK when logged in, else 403, unauthorized
        return Unauthorized("You are not logged in");
    }

    [HttpGet("Logout")]
    public IActionResult Logout()
    {
        return Ok("Logged out");
    }

}

public class LoginBody
{
    public string? Username { get; set; }
    public string? Password { get; set; }
}

public class LoginResponseBody
{
    public string? User { get; set;}
    public string? Password { get; set;}

    public bool IsLoggedIn { get; set;}
}