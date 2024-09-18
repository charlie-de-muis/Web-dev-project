using StarterKit.Models;
using StarterKit.Utils;

namespace StarterKit.Services;

public enum LoginStatus { IncorrectPassword, IncorrectUsername, Success }

public enum ADMIN_SESSION_KEY { adminLoggedIn }

public class LoginService : ILoginService
{

    private readonly DatabaseContext _context;

    public LoginService(DatabaseContext context)
    {
        _context = context;
    }

    public LoginStatus CheckPassword(string username, string inputPassword)
    {
        // TODO: Make this method check the password with what is in the database
            // Bente mee bezig geweest. moet waarschijnlijk verplaatst worden naar LoginController.cs
        // Console.WriteLine("Please enter username: ");
        // string username = Console.ReadLine();
        // Console.WriteLine("Please enter password");
        // string inputPassword = Console.ReadLine();

            // Check if the input password matches the stored hashed password
        bool isPasswordValid = EncryptionHelper.VerifyPassword(inputPassword, "admin");

        if (username == "admin" && isPasswordValid == true)
        {
            Console.WriteLine("You've logged in successfully!");
            return LoginStatus.Success;
            // log in idk how to implement
        }
        else
        {            
            Console.WriteLine("Password or Username is incorrect");
            return LoginStatus.IncorrectPassword;
        }
    }
}