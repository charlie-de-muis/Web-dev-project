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

    [HttpPost("Login")] // to do: sessions aanmaken, sessions verwijderen bij uitloggen, 
    // account meegeven als er ingelogd is, isloggedin check maken
    public IActionResult Login([FromBody] LoginBody loginBody)
    { // EncryptionHelper.EncryptPassword(loginBody.Password)) --> als het encrypted moet worden om te checken
        LoginStatus status =  _loginService.CheckPassword(loginBody.Username, loginBody.Password);
        if (status == LoginStatus.IncorrectUsername){return Unauthorized("Incorrect username");}
        else if (status == LoginStatus.IncorrectPassword){return Unauthorized("Incorrect password");}
        else if (status == LoginStatus.Success){return Ok($"Log in succesful for {loginBody.Username}");}
        else{return Unauthorized("Unknown error");}
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
