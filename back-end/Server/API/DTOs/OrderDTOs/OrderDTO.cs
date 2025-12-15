using API.Models.Enums;

namespace API.DTOs.OrderDTOs;

public class OrderDTO
{
    public string Id { get; set; } = $"ORD-{Guid.NewGuid()}";
    public int UserId { get; set; }
    public string CustomerName { get; set; } = default!;
    public string CustomerEmail { get; set; } = default!;
    public DateTime Date { get; set; }
    public OrderStatus Status { get; set; }
    public decimal Total { get; set; }
    public OrderShippingDTO Shipping { get; set; } = new();
    public List<OrderItemDTO> Items { get; set; } = new();
}

public class OrderItemDTO
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Name { get; set; } = default!;
    public string Brand { get; set; } = default!;
    public string Volume { get; set; } = default!;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string Image { get; set; } = default!;
    public decimal Subtotal { get; set; }
}

public class OrderShippingDTO
{
    public string Address { get; set; } = default!;
    public string City { get; set; } = default!;
    public string State { get; set; } = default!;
    public string Zip { get; set; } = default!;
    public string Country { get; set; } = default!;
}
