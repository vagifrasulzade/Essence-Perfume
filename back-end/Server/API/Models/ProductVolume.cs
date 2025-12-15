using API.Models.Entity;

namespace API.Models;

public class ProductVolume:BaseEntity
{
    public int ProductId { get; set; }
    public Product Product { get; set; }
    public int Size { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}
