using API.DTOs.AuthDTOs;
using API.Services.Interfaces;
using API.Validation.AuthValidations;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        try
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { error = "Email and password are required!" });

            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO dto)
    {
        try
        {
            var validator = new CreateUserValidator();
            var validateResult = await validator.ValidateAsync(dto);
            
            if (!validateResult.IsValid)
            {
                var errors = validateResult.Errors
                    .Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
                return BadRequest(new { errors });
            }

            var result = await _authService.RegisterAsync(dto);
            return Ok(new { message = "User registered successfully!", user = result });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

