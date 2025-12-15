using API.Data;
using API.DTOs.AuthDTOs;
using API.Helpers;
using API.Models;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly ITokenService _tokenService;

    public AuthService(AppDbContext db, IMapper mapper, ITokenService tokenService)
    {
        _db = db;
        _mapper = mapper;
        _tokenService = tokenService;
    }

    public async Task<LoginResponseDTO> LoginAsync(LoginDTO dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            throw new ArgumentException("Email and password are required!");

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "User");

        if (user == null)
            throw new UnauthorizedAccessException("Invalid email");

        if (!PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid password");

        var token = _tokenService.GenerateToken(user);
        var users = _mapper.Map<UserDTO>(user);

        return new LoginResponseDTO
        {
            Token = token,
            User = users
        };
    }

    public async Task<LoginResponseDTO> AdminLoginAsync(LoginDTO dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            throw new ArgumentException("Email and password are required!");

        var admin = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "Admin");

        if (admin == null)
            throw new UnauthorizedAccessException("Invalid email");

        if (!PasswordHelper.VerifyPassword(dto.Password, admin.PasswordHash))
            throw new UnauthorizedAccessException("Invalid password");

        var token = _tokenService.GenerateToken(admin);

        var user = _mapper.Map<UserDTO>(admin);

        return new LoginResponseDTO
        {
            Token = token,
            User = user
        };
    }

    public async Task<UserDTO> RegisterAsync(CreateUserDTO dto)
    {
        if (dto == null)
            throw new ArgumentNullException(nameof(dto));

        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new ArgumentNullException(nameof(dto.Email), "Email is required!");

        if (await EmailExists(dto.Email) == true)
            throw new InvalidOperationException("User with this email already exists!");

        var user = _mapper.Map<User>(dto);
        user.PasswordHash = PasswordHelper.HashPassword(dto.Password!);
        user.CreatedAt = DateTimeOffset.UtcNow;

        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();

        return _mapper.Map<UserDTO>(user);
    }

    public async Task<UserDTO?> GetUserByIdAsync(int id)
    {
        
        var user = await CheckUserIdAsync(id);
        if(user is null) return null;
        return _mapper.Map<UserDTO>(user);
    }

    public async Task<UserDTO?> GetUserByEmailAsync(string email)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
            return null;

        return _mapper.Map<UserDTO>(user);
    }

    public async Task ChangePasswordAsync(int userId, ChangePasswordDTO dto)
    {
        if (dto == null)
            throw new ArgumentNullException(nameof(dto));

        var user = await CheckUserIdAsync(userId);

        if (!PasswordHelper.VerifyPassword(dto.CurrentPassword, user.PasswordHash))
            throw new UnauthorizedAccessException("Current password is incorrect!");

        if (PasswordHelper.VerifyPassword(dto.NewPassword, user.PasswordHash))
            throw new InvalidOperationException("New password must be different from current password!");

        
        user.PasswordHash = PasswordHelper.HashPassword(dto.NewPassword);
        user.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
    }

    public async Task<UserDTO> UpdateUserAsync(int userId, UpdateUserDTO dto)
    {
        if (dto == null)
            throw new ArgumentNullException(nameof(dto));

        var user = await CheckUserIdAsync(userId);

        user.FirstName = dto.FirstName ?? user.FirstName;
        user.LastName = dto.LastName ?? user.LastName;
        user.Email = dto.Email ?? user.Email;
        
        // Update phone and shipping address (allow null/empty to clear)
        user.Phone = dto.Phone;
        user.Address = dto.Address;
        user.City = dto.City;
        user.State = dto.State;
        user.ZipCode = dto.ZipCode;
        user.Country = dto.Country;
        
        user.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();

        return _mapper.Map<UserDTO>(user);
    }

    public async Task RemoveUserAsync(int userId)
    {
        var user = await CheckUserIdAsync(userId);
        if (user == null)
            throw new ArgumentNullException(nameof(user));
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
    }

    public async Task SoftDeleteUserAsync(int userId)
    {
        var user = await CheckUserIdAsync(userId);
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        user.IsDeleted = true;
        user.DeletedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
    }

    public async Task RecoverUserAsync(int userId)
    {
        var user = await CheckUserIdAsync(userId, includeDeleted: true);
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        if (user.IsDeleted != true)
            throw new InvalidOperationException("User is not deleted");

        user.IsDeleted = false;
        user.DeletedAt = null;

        await _db.SaveChangesAsync();
    }

    private async Task<bool?> EmailExists(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return null;

        return await _db.Users.AnyAsync(u => u.Email == email);
    }

    private async Task<User> CheckUserIdAsync(int id, bool includeDeleted = false)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);

        if (user is null || (!includeDeleted && user.IsDeleted.GetValueOrDefault()))
            throw new NullReferenceException($"User with id {id} not found!");

        return user;
    }

   
}
