using API.Models.Entity;
using API.Models.Enums;

namespace API.Models;

public class Order:BaseEntity
{
    public new string Id { get; set; } = $"ORD-{Guid.NewGuid()}";
    
    public int UserId { get; set; }     
    public string CustomerName { get; set; } = default!;
    public string CustomerEmail { get; set; } = default!;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public OrderStatus Status { get; set; } = OrderStatus.Pending; 
    public decimal Total { get; set; }                             

    public OrderShipping Shipping { get; set; } = new();          
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
