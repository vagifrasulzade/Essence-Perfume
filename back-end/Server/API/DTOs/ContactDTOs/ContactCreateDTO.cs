using System.ComponentModel.DataAnnotations;

namespace API.DTOs.ContactDTOs;

public class ContactCreateDTO
{

    public string FullName { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    
    public string Phone { get; set; }
    
    public string Subject { get; set; }
    public string Message { get; set; }



}
