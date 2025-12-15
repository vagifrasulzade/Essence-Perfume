using API.DTOs.ProductDTOs;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/user")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IProductService _service;

    public ProductController(IProductService service)
    {
        _service = service;
    }

    [HttpGet("Product/All")]
    public async Task<IActionResult> GetAll([FromQuery] ProductRequestDTO request)
    {
        try
        {
            var products = await _service.GetAllAsync(request);
            return Ok(products);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("Product/Search")]
    public async Task<IActionResult> Search([FromQuery] string? brand, string? name)
    {
        try
        {
            var product = await _service.Getasync(brand, name);
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });

        }
    }


    [HttpGet("Product/{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound(new { error = "Product not found" });
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

}