using API.DTOs.Pagination;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs.ProductDTOs;

public class ProductRequestDTO : PaginationRequest
{
    [FromQuery(Name = "search")]
    public string? Search { get; set; }
    
    [FromQuery(Name = "featured")]
    public bool? Featured { get; set; }
}
