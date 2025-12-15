using API.Data;
using API.Helpers;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public static class DatabaseSeeder
{
    public static async Task SeedDefaultAdminAsync(AppDbContext context)
    {
        // Check if admin user already exists by email
        var adminExists = await context.Users
            .AnyAsync(u => u.Email == "admin@gmail.com" && u.Role == "Admin");

        if (!adminExists)
        {
            // Create default admin user
            var adminUser = new User
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@gmail.com",
                PasswordHash = PasswordHelper.HashPassword("admin123"),
                Role = "Admin",
                CreatedAt = DateTimeOffset.UtcNow
            };

            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }
        else
        {
            // Verify admin user exists and has correct password
            var existingAdmin = await context.Users
                .FirstOrDefaultAsync(u => u.Email == "admin@gmail.com" && u.Role == "Admin");
            
            if (existingAdmin != null)
            {
                // Verify password hash matches
                var correctPasswordHash = PasswordHelper.HashPassword("admin123");
                if (existingAdmin.PasswordHash != correctPasswordHash)
                {
                    // Update password if it doesn't match
                    existingAdmin.PasswordHash = correctPasswordHash;
                    existingAdmin.UpdatedAt = DateTimeOffset.UtcNow;
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}

