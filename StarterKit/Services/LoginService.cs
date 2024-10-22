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

    private readonly List<User> _users = new();

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
        if (admin.Password == EncryptionHelper.EncryptPassword(inputPassword))
        {
            return LoginStatus.Success; // Password matches
        }
        else
        {
            return LoginStatus.IncorrectPassword; // Password doesn't match
        }
    }

    public bool IsAdmin(string username)
    {
        // Retrieve the admin by username
        var admin = _context.Admin.SingleOrDefault(a => a.UserName == username);
        return admin != null; // Returns true if admin exists
    }

    public RegistrationStatus RegisterUser(string username, string password, bool isAdmin)
    {
        // Check if the username already exists
        if (_users.Any(u => u.Username == username))
        {
            return RegistrationStatus.UserAlreadyExists;
        }

        // If user doesn't exist, create a new user
        var newUser = new User
        {
            Username = username,
            Password = password, // Consider hashing the password for security
            IsAdmin = isAdmin
        };

        _users.Add(newUser); // Simulating saving to a database

        return RegistrationStatus.Success;
    }
}

public class User
{
    public string Username { get; set; }
    public string Password { get; set; }
    public bool IsAdmin { get; set; }
}

public enum RegistrationStatus
{
    Success,
    UserAlreadyExists
}