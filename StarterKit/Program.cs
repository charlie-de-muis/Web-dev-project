using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace StarterKit
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllersWithViews();

            builder.Services.AddDistributedMemoryCache();

            builder.Services.AddSession(options => 
            {
                options.IdleTimeout = TimeSpan.FromSeconds(10);
                options.Cookie.HttpOnly = true; 
                options.Cookie.IsEssential = true; 
            });

            // Configure cookie authentication
            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options => 
                {
                    options.LoginPath = "/api/v1/Login"; // Redirect here on unauthorized access
                    options.LogoutPath = "/api/v1/Login/Logout"; // Optional, if you want to handle logout
                    options.AccessDeniedPath = "/api/v1/Login/AccessDenied"; // Optional
                });

            builder.Services.AddScoped<ILoginService, LoginService>();

            builder.Services.AddDbContext<DatabaseContext>(
                options => options.UseSqlite(builder.Configuration.GetConnectionString("SqlLiteDb")));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseSession();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");


            app.Urls.Add("http://localhost:5097");
            app.Run();

        }
    }
}