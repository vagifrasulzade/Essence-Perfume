using API.DTOs.AuthDTOs;
using API.Services.Interfaces;
using API.Validation.AuthValidations;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/user")]
[ApiController]
[Authorize(Roles = "User,Admin")]
public class UserController : ControllerBase
{
    private readonly IAuthService _authService;

    public UserController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var user = await _authService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound(new { error = "User not found!" });

            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDTO dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var validator = new UpdateUserValidator();
            var validateResult = await validator.ValidateAsync(dto);
            
            if (!validateResult.IsValid)
            {
                var errors = validateResult.Errors
                    .Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
                return BadRequest(new { errors });
            }

            var result = await _authService.UpdateUserAsync(userId, dto);
            return Ok(new { message = "User updated successfully!", user = result });
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

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });

            var validator = new ChangePasswordValidator();
            var validateResult = await validator.ValidateAsync(dto);
            
            if (!validateResult.IsValid)
            {
                var errors = validateResult.Errors
                    .Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
                return BadRequest(new { errors });
            }

            await _authService.ChangePasswordAsync(userId, dto);
            return Ok(new { message = "Password changed successfully!" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    [HttpPatch("Soft Delete")]
    public async Task<IActionResult> SoftDeleteUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });
            await _authService.SoftDeleteUserAsync(userId);
            return Ok(new { message = "User soft deleted successfully!" });
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
    [HttpPatch("Recover")]
    public async Task<IActionResult> RecoverUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });
            await _authService.RecoverUserAsync(userId);
            return Ok(new { message = "User recovered successfully!" });
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

    [HttpDelete("Delete")]
    public async Task<IActionResult> DeleteUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { error = "Invalid token!" });
            await _authService.RemoveUserAsync(userId);
            return Ok(new { message = "User deleted successfully!" });
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


}

