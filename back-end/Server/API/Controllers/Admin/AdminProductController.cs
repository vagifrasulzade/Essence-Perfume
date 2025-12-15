using API.DTOs.ProductDTOs;
using API.Services.Interfaces;
using API.Validation.ContactValidations;
using API.Validation.ProductValidations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin;

[Route("api/admin")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminProductController : ControllerBase
{
    private readonly IProductService _service;
    private readonly ICloudinaryService _cloudinaryService;

    public AdminProductController(IProductService service, ICloudinaryService cloudinaryService)
    {
        _service = service;
        _cloudinaryService = cloudinaryService;
    }

    [HttpGet("Product/All")]
    public async Task<IActionResult> GetAll([FromQuery] ProductRequestDTO request)
    {
        try
        {
            var result = await _service.GetAllAsync(request);
            return Ok(result);
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
            {
                return NotFound(new { error = $"Product with id {id} not found!" });
            }
            return Ok(product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("Product/Add")]
    public async Task<IActionResult> Create([FromBody] ProductCreateDTO dto)
    {
        try
        {
            if (dto == null)
            {
                return BadRequest(new { error = "Product data is required." });
            }

            var validateResult = await new CreateProductValidator().ValidateAsync(dto);

            if (!validateResult.IsValid)
            {
                var errors = validateResult.Errors
                     .Select(e => $"{e.PropertyName}: {e.ErrorMessage}")
                     .ToList();
                return BadRequest(new { errors = errors });
            }

            var createdProduct = await _service.CreateAsync(dto);
            
            if (createdProduct == null)
            {
                return StatusCode(500, new { error = "Failed to create product." });
            }

            return Ok(new { message = "Product created successfully.", product = createdProduct });

        }
        catch (Exception ex)
        {
            // Include full exception details for debugging
            var errorMessage = ex.Message;
            if (ex.InnerException != null)
            {
                errorMessage += $" | Inner: {ex.InnerException.Message}";
                if (ex.InnerException.InnerException != null)
                {
                    errorMessage += $" | {ex.InnerException.InnerException.Message}";
                }
            }
            return BadRequest(new { error = errorMessage, stackTrace = ex.StackTrace });
        }

    }
    [HttpPut("Product/{id:int}/update")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDTO dto)
    {
        try
        {
            if (dto == null)
            {
                return BadRequest(new { error = "Product data is required." });
            }

            var validateResult = await new UpdateProductValidator().ValidateAsync(dto);
            if (!validateResult.IsValid)
            {
                var errors = validateResult.Errors
                     .Select(e => $"{e.PropertyName}: {e.ErrorMessage}")
                     .ToList();
                return BadRequest(new { errors = errors });
            }

            var updatedProduct = await _service.UpdateAsync(id, dto);
            
            if (updatedProduct == null)
            {
                return StatusCode(500, new { error = "Failed to update product." });
            }

            return Ok(new { message = "Product updated successfully.", product = updatedProduct });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message, innerException = ex.InnerException?.Message });
        }
    }
    [HttpPatch("Product/{id:int}/soft")]
    public async Task<IActionResult> SoftDelete(int id)
    {
        try
        {
            await _service.SoftDeleteAsync(id);
            return Ok(new { message = "Product deleted successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPatch("Product/{id:int}/recover")]
    public async Task<IActionResult> Recover(int id)
    {
        try
        {
            await _service.RecoverAsync(id);
            return Ok(new { message = "Product recovered successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    [HttpPatch("Product/{id:int}/featured")]
    public async Task<IActionResult> UpdateFeaturedStatus(int id, [FromBody] UpdateFeaturedStatusDTO dto)
    {
        try
        {
            var featured = await _service.UpdateFeaturedStatusAsync(id, dto.Featured);
            return Ok(new { message = "Featured status updated successfully!", featured = featured });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }


    [HttpDelete("Product/{id:int}/delete")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.RemoveAsync(id);
            return Ok(new { message = "Product deleted successfully!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("Product/upload-image")]
    [Consumes("multipart/form-data")]
    [ApiExplorerSettings(IgnoreApi = true)] // Hide from Swagger to avoid file upload issues
    [RequestFormLimits(MultipartBodyLengthLimit = 10485760)] // 10MB
    [RequestSizeLimit(10485760)] // 10MB
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "No file provided" });
            }

            var result = await _cloudinaryService.UploadImageAsync(file);

            if (result == null)
            {
                return StatusCode(500, new { error = "Failed to upload image" });
            }

            return Ok(new
            {
                url = result.Value.Url,
                publicId = result.Value.PublicId
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while uploading the image", details = ex.Message });
        }
    }

}