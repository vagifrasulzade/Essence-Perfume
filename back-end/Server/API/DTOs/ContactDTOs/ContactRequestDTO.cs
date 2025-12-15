using API.DTOs.Pagination;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs.ContactDTOs;

public class ContactRequestDTO : PaginationRequest
{
    [FromQuery(Name = "search")]

    public string? Search { get; set; }

    [FromQuery(Name = "date")]
    public DateTimeOffset? Date { get; set; }

}
