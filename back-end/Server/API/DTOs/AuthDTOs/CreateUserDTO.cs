using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AuthDTOs;

public class CreateUserDTO
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;

    [EmailAddress]
    public string? Email { get; set; }
        
    
    public string? Password { get; set; } 

    public string? ConfirmPassword { get; set; }
}
