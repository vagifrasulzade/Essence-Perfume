using API.DTOs.OrderDTOs;
using API.Services.Interfaces;
using API.Validation.OrderValidations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin;

[Route("api/admin")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminOrderController : ControllerBase
{
    private readonly IOrderService _service;

    public AdminOrderController(IOrderService service)
    {
        _service = service;
    }

    [HttpGet("orders/all")]
    public async Task<IActionResult> GetAll([FromQuery] OrderRequestDTO request)
    {
        try
        {
            var orders = await _service.GetAllAsync(request);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("orders/{orderId}")]
    public async Task<IActionResult> GetById(string orderId)
    {
        try
        {
            var order = await _service.GetByIdAsync(orderId);
            if (order == null)
                return NotFound(new { error = "Order not found" });

            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("orders/{orderId}/status")]
    public async Task<IActionResult> UpdateStatus(string orderId, [FromBody] OrderUpdateDTO dto)
    {
        try
        {
            var validateResult = await new UpdateOrderValidator().ValidateAsync(dto);
            if (!validateResult.IsValid)
            {
                var errors = validateResult.Errors
                    .Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
                return BadRequest(errors);
            }

            await _service.UpdateStatusAsync(orderId, dto);
            return Ok(new { message = "Order status updated successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("orders/{orderId}/shipping")]
    public async Task<IActionResult> UpdateShipping(string orderId, [FromBody] OrderShippingUpdateDTO dto)
    {
        try
        {
            var validateResult = await new OrderShippingUpdateValidator().ValidateAsync(dto);
            if (!validateResult.IsValid)
            {
                var errors = validateResult.Errors
                    .Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
                return BadRequest(errors);
            }

            await _service.UpdateShippingAsync(orderId, dto);
            return Ok(new { message = "Shipping information updated successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("orders/{orderId}/soft")]
    public async Task<IActionResult> SoftDelete(string orderId)
    {
        try
        {
            await _service.SoftDeleteAsync(orderId);
            return Ok(new { message = "Order deleted successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("orders/{orderId}/recover")]
    public async Task<IActionResult> Recover(string orderId)
    {
        try
        {
            await _service.RecoverAsync(orderId);
            return Ok(new { message = "Order recovered successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("orders/{orderId}/delete")]
    public async Task<IActionResult> Delete(string orderId)
    {
        try
        {
            await _service.RemoveAsync(orderId);
            return Ok(new { message = "Order deleted successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
