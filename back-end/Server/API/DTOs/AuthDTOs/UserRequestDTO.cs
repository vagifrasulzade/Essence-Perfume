using API.DTOs.Pagination;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs.AuthDTOs;

public class UserRequestDTO : PaginationRequest
{
    [FromQuery(Name = "search")]

    public string? Search { get; set; }

    [FromQuery(Name = "startDate")]

    public DateTimeOffset? StartDate { get; set; }

    [FromQuery(Name = "endDate")]
    public DateTimeOffset? EndDate { get; set; }

}
