using API.DTOs.ContactDTOs;
using API.Services.Interfaces;
using API.Validation.ContactValidations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin
{
    
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminContactMessageController : ControllerBase
    {
        private readonly IContactService _service;

        public AdminContactMessageController(IContactService service)
        {
            _service = service;
        }


        [HttpGet("contact-messages/all")]
        public async Task<IActionResult> GetAll([FromQuery] ContactRequestDTO request)
        {
            try
            {
                var contacts = await _service.GetAllAsync(request);
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("contact-messages/search")]
        public async Task<IActionResult> Search([FromQuery] string? fullname, string? email , string?phone)
        {
            try
            {
                var result = await _service.GetAsync(fullname,email,phone);
                if (result == null)
                    return NotFound(new { error = "Contact message not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpGet("contact-messages/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var contacts = await _service.GetByIdAsync(id);

                
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }



        

        [HttpPut("contact-messages/{id:int}/update")]
        public async Task<IActionResult> Update(int id, [FromBody] ContactUpdateDTO dto)
        {
            try
            {
                var validateResult = await new UpdateContactValidator().ValidateAsync(dto);
                if (!validateResult.IsValid)
                {
                    var errors = validateResult.Errors
                         .Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
                    return BadRequest(errors);
                }
                await _service.UpdateAsync(id, dto);
                return Ok(new { message = "Contact message updated successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpPatch("contact-messages/{id:int}/soft")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            try
            {
                await _service.SoftDeleteAsync(id);
                return Ok(new { message = "Contact message deleted successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpPatch("contact-messages/{id:int}/recover")]
        public async Task<IActionResult> Recover(int id)
        {
            try
            {
                await _service.RecoverAsync(id);
                return Ok(new { message = "Contact message recovered successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpDelete("contact-messages/{id:int}/delete")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.RemoveAsync(id);
                return Ok(new { message = "Contact message deleted successfully!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}

