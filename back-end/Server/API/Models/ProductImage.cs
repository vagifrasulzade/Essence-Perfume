using API.Models.Entity;

namespace API.Models;

public class ProductImage : BaseEntity
{
    public int ProductId { get; set; }
    public Product Product { get; set; } 
    public string Url { get; set; } = default!;

    public string? PublicId { get; set; }
    public int Sort { get; set; }
}
