using API.Models.Entity;

namespace API.Models;

public class ContactMessage : BaseEntity
{
    public string FullName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }

    public string Subject { get; set; }

    public string Message { get; set; }

}
