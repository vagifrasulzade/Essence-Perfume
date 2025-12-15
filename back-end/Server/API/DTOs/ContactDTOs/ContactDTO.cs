namespace API.DTOs.ContactDTOs;

public class ContactDTO
{
    public int Id { get; set; }

    public string FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }

    public string? Subject { get; set; }

    public string? Message { get; set; }

    public DateTimeOffset Date { get; set; }
    
}
