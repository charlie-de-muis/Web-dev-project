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

    private readonly Dictionary<string, User> _users = new Dictionary<string, User>();

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
        if (_users.ContainsKey(username))
            return RegistrationStatus.UserAlreadyExists;

        var newUser = new User
        {
            Username = username,
            Password = password,
            IsAdmin = isAdmin
        };

        _users.Add(username, newUser);
        return RegistrationStatus.Success;
    }
}

public class User
{
    public string Username { get; set; }
    public string Password { get; set; }
    public bool IsAdmin { get; set; }
}