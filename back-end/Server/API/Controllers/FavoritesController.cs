using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[Route("api/user")]
[ApiController]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpGet("Favorites")]
    public async Task<IActionResult> GetFavorites()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var productIds = await _favoriteService.GetFavoritesAsync(userId);
            return Ok(new { productIds });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("Favorites/Add")]
    public async Task<IActionResult> AddFavorite([FromBody] FavoriteRequestDTO dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var productIds = await _favoriteService.AddFavoriteAsync(userId, dto.ProductId);
            return Ok(new { productIds });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }


    [HttpPost("Favorites/Toggle")]
    public async Task<IActionResult> ToggleFavorite([FromBody] FavoriteRequestDTO dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var productIds = await _favoriteService.ToggleFavoriteAsync(userId, dto.ProductId);
            return Ok(new { productIds });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("Favorites/Remove/{productId}")]
    public async Task<IActionResult> RemoveFavorite(int productId)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var productIds = await _favoriteService.RemoveFavoriteAsync(userId, productId);
            return Ok(new { productIds });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public class FavoriteRequestDTO
{
    public int ProductId { get; set; }
}

