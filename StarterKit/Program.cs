using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Configure services
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Configure cookie authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/api/v1/Login";
        options.LogoutPath = "/api/v1/Login/Logout";
        options.AccessDeniedPath = "/api/v1/Login/AccessDenied";
    });

builder.Services.AddScoped<ILoginService, LoginService>();

builder.Services.AddDbContext<DatabaseContext>(
    options => options.UseSqlite(builder.Configuration.GetConnectionString("SqlLiteDb")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000") // React app URL
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials(); // Required for cookies
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Add CORS middleware
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Urls.Add("http://localhost:5097");
app.Run();

