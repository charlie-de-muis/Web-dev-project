using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Utils;

namespace StarterKit.Services;

public enum LoginStatus { IncorrectPassword, IncorrectUsername, Success }

public class LoginService : ILoginService
{
    private readonly DatabaseContext _context;

    public LoginService(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<LoginStatus> CheckPassword(string username, string inputPassword)
    {
        // Retrieve the admin with the specified username
        var admin = await _context.Admin.FirstOrDefaultAsync(a => a.UserName == username);
        User? user = await _context.User.FirstOrDefaultAsync(u => u.FirstName == username);

        // Check if the admin with the given username exists
        if (admin == null && user == null)
        {
            return LoginStatus.IncorrectUsername; // Username doesn't exist in the database
        }

        // Compare the provided password with the stored password
        if (admin != null && admin.Password == EncryptionHelper.EncryptPassword(inputPassword))
        {
            return LoginStatus.Success; // Password matches
        }
        if (user != null && user.Password == EncryptionHelper.EncryptPassword(inputPassword))
        {
            return LoginStatus.Success;
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

    public async Task<User?> RegisterUser(User user)
    {
        // Check if the user already exists by email (or username, if available)
        var usermaybe = await _context.User.FirstOrDefaultAsync(u => u.Email == user.Email);

        if (usermaybe is User)
        {
            // If user exists, return null
            return null;
        }

        // If user doesn't exist, create a new user
        User newUser = new User
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Password = EncryptionHelper.EncryptPassword(user.Password),
            RecuringDays = user.RecuringDays,
            Attendances = new List<Attendance>(), // Initialize as an empty list
            Event_Attendances = new List<Event_Attendance>() // Initialize as an empty list
        };

        await _context.User.AddAsync(newUser);
        await _context.SaveChangesAsync();
        return newUser;
    }

    // New method to get User ID by Username
    public async Task<int?> GetUserIdByUsername(string username)
    {
        // Attempt to find an admin first by their username
        var admin = await _context.Admin.FirstOrDefaultAsync(a => a.UserName == username);
        if (admin != null)
        {
            return admin.AdminId; // Return the UserId if an admin is found
        }

        // If no admin found, attempt to find a regular user by their first name or email
        var user = await _context.User.FirstOrDefaultAsync(u => u.FirstName == username || u.Email == username);
        return user?.UserId; // Return the UserId for the regular user, or null if not found
    }

}
