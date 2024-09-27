using SQLitePCL;
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
        // Retrieve the admin with the specified username
        var admin = _context.Admin.SingleOrDefault(a => a.UserName == username);
        
        // Check if the admin with the given username exists
        if (admin == null)
        {
            return LoginStatus.IncorrectUsername; // Username doesn't exist in the database
        }

        // Compare the provided password with the stored password
        if (admin.Password == inputPassword)
        {
            return LoginStatus.Success; // Password matches
        }
        else
        {
            return LoginStatus.IncorrectPassword; // Password doesn't match
        }
    }
}