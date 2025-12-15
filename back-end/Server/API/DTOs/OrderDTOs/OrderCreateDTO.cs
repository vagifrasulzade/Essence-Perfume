using System.ComponentModel.DataAnnotations;

namespace API.DTOs.OrderDTOs;

public class OrderCreateDTO
{
    public List<OrderItemCreateDTO> Items { get; set; } = new();
    
    public OrderShippingCreateDTO Shipping { get; set; } = new();
}

public class OrderItemCreateDTO
{
    public int ProductId { get; set; }
    
    /// <summary>
    /// Volume size in milliliters (e.g., 50, 100, 200). This refers to ProductVolume.Size, not ProductVolume.Id.
    /// </summary>
    public int Volume { get; set; }
    
    public int Quantity { get; set; }
}

public class OrderShippingCreateDTO
{
  
    public string FirstName { get; set; } = default!;

    public string LastName { get; set; } = default!;
    
    [EmailAddress]
    public string Email { get; set; } = default!;
    
  
    public string Phone { get; set; } = default!;
 
    public string Address { get; set; } = default!;
    
   
    public string City { get; set; } = default!;
    
  
    public string ZipCode { get; set; } = default!;
    
    
    public string Country { get; set; } = default!;
}
