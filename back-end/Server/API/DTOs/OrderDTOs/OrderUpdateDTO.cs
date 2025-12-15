using API.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs.OrderDTOs;

public class OrderUpdateDTO
{
    public OrderStatus Status { get; set; }
}

public class OrderShippingUpdateDTO
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
