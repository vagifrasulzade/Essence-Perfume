using API.DTOs.OrderDTOs;
using API.Services.Interfaces;
using API.Validation.OrderValidations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[Route("api/user")]
[ApiController]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _service;

    public OrderController(IOrderService service)
    {
        _service = service;
    }

    

    [HttpGet("orders")]
    public async Task<IActionResult> GetUserOrders()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var orders = await _service.GetUserOrdersAsync(userId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("orders/{orderId}")]
    public async Task<IActionResult> GetUserOrderById(string orderId)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var order = await _service.GetUserOrderByIdAsync(orderId, userId);
            if (order == null)
                return NotFound(new { error = "Order not found" });

            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("orders/create")]
    public async Task<IActionResult> Create([FromBody] OrderCreateDTO dto)
    {
        try
        {
            var validateResult = await new CreateOrderValidator().ValidateAsync(dto);
            if (!validateResult.IsValid)
            {
                var errors = validateResult.Errors
                    .Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
                return BadRequest(new { errors });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var order = await _service.CreateAsync(dto, userId);
            return Created("Order created successfully.", order);
        }
        catch (Exception ex)
        {
            // Include inner exception details for debugging
            var errorMessage = ex.Message;
            if (ex.InnerException != null)
            {
                errorMessage += $" | Inner Exception: {ex.InnerException.Message}";
                if (ex.InnerException.InnerException != null)
                {
                    errorMessage += $" | {ex.InnerException.InnerException.Message}";
                }
            }
            return BadRequest(new { error = errorMessage });
        }
    }
}
