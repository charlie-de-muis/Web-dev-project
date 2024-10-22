namespace StarterKit.Services;

public interface ILoginService {
    public LoginStatus CheckPassword(string username, string inputPassword);
    bool IsAdmin(string username);
}

public enum RegistrationStatus
{
    Success,
    UserAlreadyExists,
    Failure
}