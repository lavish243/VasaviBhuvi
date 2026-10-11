
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.API;

public static class SeedData
{
    public static async Task InitializeAsync(
        IServiceProvider services,
        IConfiguration configuration)
    {
        using var scope = services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Apply database migrations
        await db.Database.MigrateAsync();

        // Create User and Admin roles
        var roles = scope.ServiceProvider
            .GetRequiredService<RoleManager<IdentityRole>>();

        foreach (var role in new[] { "User", "Admin" })
        {
            if (!await roles.RoleExistsAsync(role))
            {
                var roleResult = await roles.CreateAsync(
                    new IdentityRole(role));

                if (!roleResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        "Could not create role: " + role);
                }
            }
        }

        // Create the initial administrator from User Secrets
        var adminEmail = configuration["BootstrapAdmin:Email"];
        var adminPassword = configuration["BootstrapAdmin:Password"];

        if (!string.IsNullOrWhiteSpace(adminEmail) &&
            !string.IsNullOrWhiteSpace(adminPassword))
        {
            var users = scope.ServiceProvider
                .GetRequiredService<UserManager<AppUser>>();

            var admin = await users.FindByEmailAsync(adminEmail);

            if (admin is null)
            {
                admin = new AppUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FullName = configuration["BootstrapAdmin:FullName"]
                        ?? "Site Administrator"
                };

                var result = await users.CreateAsync(admin, adminPassword);

                if (!result.Succeeded)
                {
                    throw new InvalidOperationException(
                        "Could not create bootstrap admin: " +
                        string.Join("; ",
                            result.Errors.Select(x => x.Description)));
                }
            }

            if (!await users.IsInRoleAsync(admin, "Admin"))
            {
                var roleResult = await users.AddToRoleAsync(admin, "Admin");

                if (!roleResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        "Could not assign Admin role: " +
                        string.Join("; ",
                            roleResult.Errors.Select(x => x.Description)));
                }
            }
        }

        // Add initial project content if the table is empty
        if (!await db.Projects.AnyAsync())
        {
            db.Projects.Add(new ProjectContent
            {
                Name = "Vasavi Bhuvi",
                Tagline = "A thoughtfully designed address for modern living",
                Description = "Premium residential project",
                IsPublished = true
            });

            await db.SaveChangesAsync();
        }
    }
}
