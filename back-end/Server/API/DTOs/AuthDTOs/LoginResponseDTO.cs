namespace API.DTOs.AuthDTOs;

public class LoginResponseDTO
{
    public string Token { get; set; } = default!;
    public UserDTO User { get; set; } = default!;

}
