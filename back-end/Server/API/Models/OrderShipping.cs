using API.Models.Entity;

namespace API.Models;

public class OrderShipping : BaseEntity
{
    public string OrderId { get; set; } = default!;
    public Order Order { get; set; }
    
    public string Address { get; set; } = default!;
    public string City { get; set; } = default!;
    public string State { get; set; } = default!;
    public string Zip { get; set; } = default!;
    public string Country { get; set; } = default!;
}
