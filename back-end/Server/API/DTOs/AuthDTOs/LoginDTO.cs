using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AuthDTOs;

public class LoginDTO
{
    [EmailAddress]
    public string? Email { get; set; }
    public string? Password { get; set; } 
}
