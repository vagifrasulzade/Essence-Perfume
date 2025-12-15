namespace API.DTOs.AuthDTOs;

public class ChangePasswordDTO
{
    public string CurrentPassword { get; set; } = default!;
    public string NewPassword { get; set; } = default!;
}
