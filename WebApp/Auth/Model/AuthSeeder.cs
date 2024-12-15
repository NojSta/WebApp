﻿using Microsoft.AspNetCore.Identity;

namespace WebApp.Auth.Model;

public class AuthSeeder
{
    private readonly UserManager<ForumUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthSeeder(UserManager<ForumUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }
    
    public async Task SeedAsync()
    {
        await AddDefaultRolesAsync();
        await AddAdminUserAsync();
    }

    private async Task AddAdminUserAsync()
    {
        var newAdminUser = new ForumUser()
        {
            UserName = "admin",
            Email = "admin@admin.com",
        };
        var existAdminUser = await _userManager.FindByNameAsync(newAdminUser.UserName);
        if (existAdminUser == null)
        {
            var createAdminUserResult = await _userManager.CreateAsync(newAdminUser, "Adminadmin1!");
            if (createAdminUserResult.Succeeded)
            {
                await _userManager.AddToRolesAsync(newAdminUser, ForumRoles.All);
            }
        }
    }

    private async Task AddDefaultRolesAsync()
    {
        foreach (var role in ForumRoles.All)
        {
            var roleExist = await _roleManager.RoleExistsAsync(role);
            if (!roleExist)
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}