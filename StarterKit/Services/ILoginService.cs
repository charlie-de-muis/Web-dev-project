namespace StarterKit.Services;

public interface ILoginService {
    public LoginStatus CheckPassword(string username, string inputPassword);
    bool IsAdmin(string username);
    RegistrationStatus RegisterUser(string username, string password, bool isAdmin);
}