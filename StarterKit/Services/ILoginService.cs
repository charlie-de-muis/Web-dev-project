namespace StarterKit.Services;

public interface ILoginService {
    public Task<LoginStatus> CheckPassword(string username, string inputPassword);
    bool IsAdmin(string username);
    Task<Models.User?> RegisterUser(Models.User user);
}