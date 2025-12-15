using API.Models.Entity;

namespace API.Models;

public class OrderItem:BaseEntity
{
    public string OrderId { get; set; } = default!;
    public Order Order { get; set; }

    public int ProductId { get; set; }             
    public string Name { get; set; } = default!;
    public string Brand { get; set; } = default!;
    public string Volume { get; set; } = default!;  
    public decimal Price { get; set; }              
    public int Quantity { get; set; }               
    public string Image { get; set; } = default!;

    public decimal Subtotal => Price * Quantity;
}
