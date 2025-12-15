using System.ComponentModel.DataAnnotations;

namespace API.DTOs.AuthDTOs;

public class UpdateUserDTO
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;

    [EmailAddress]
    public string? Email { get; set; }
    
    // Phone and Shipping Address
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? ZipCode { get; set; }
    public string? Country { get; set; }
}
