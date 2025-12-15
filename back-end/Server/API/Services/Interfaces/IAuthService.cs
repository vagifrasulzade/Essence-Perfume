using API.DTOs.AuthDTOs;

namespace API.Services.Interfaces;

public interface IAuthService
{
    // User Auth
    Task<LoginResponseDTO> LoginAsync(LoginDTO dto);
    Task<UserDTO> RegisterAsync(CreateUserDTO dto);
    Task<UserDTO> UpdateUserAsync(int userId, UpdateUserDTO dto);

    Task RemoveUserAsync(int userId);

    Task SoftDeleteUserAsync(int userId);

    Task RecoverUserAsync(int userId);


    // Admin Auth
    Task<LoginResponseDTO> AdminLoginAsync(LoginDTO dto);

    // Common
    Task<UserDTO?> GetUserByIdAsync(int id);
    Task<UserDTO?> GetUserByEmailAsync(string email);

    // Change Password
    Task ChangePasswordAsync(int userId, ChangePasswordDTO dto);

}

