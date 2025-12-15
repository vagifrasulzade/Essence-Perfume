using API.DTOs.Pagination;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs.OrderDTOs;

public class OrderRequestDTO : PaginationRequest
{
    [FromQuery(Name = "search")]
    public string? Search { get; set; }
    
    [FromQuery(Name = "status")]
    public string? Status { get; set; }
    
    [FromQuery(Name = "userId")]
    public int? UserId { get; set; }
}
