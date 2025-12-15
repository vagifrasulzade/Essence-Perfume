using API.Models.Entity;

namespace API.Models;

public class Favorite : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = default!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = default!;
}

