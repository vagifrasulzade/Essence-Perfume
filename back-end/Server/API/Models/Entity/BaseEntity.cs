namespace API.Models.Entity;

public class BaseEntity
{
    public int Id { get; set; }
    public bool? IsDeleted { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }

    public DateTimeOffset? DeletedAt { get; set; }
}
