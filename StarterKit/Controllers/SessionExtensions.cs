public static class SessionExtensions
{
    public static bool GetBool(this ISession session, string key)
    {
        session.TryGetValue(key, out byte[] value);
        return value != null && BitConverter.ToBoolean(value, 0);
    }

    public static void SetBool(this ISession session, string key, bool value)
    {
        session.SetString(key, value ? "1" : "0");
    }
}