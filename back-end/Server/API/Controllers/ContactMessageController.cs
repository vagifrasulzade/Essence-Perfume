using API.DTOs.ContactDTOs;
using API.Services.Interfaces;
using API.Validation.ContactValidations;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    [Route("api/user")]
    [ApiController]
    public class ContactMessageController : ControllerBase
    {
        private readonly IContactService _service;

        public ContactMessageController(IContactService service)
        {
            _service = service;
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] ContactCreateDTO dto)
        {
            try
            {
                var validateResult = await new CreateContactValidator().ValidateAsync(dto);

                if (!validateResult.IsValid)
                {
                    var errors = validateResult.Errors
                         .Select(e => $"{e.PropertyName}: {e.ErrorMessage}");
                    return BadRequest(errors);
                }
                await _service.CreateAsync(dto);

                return Created("Contact message created successfully.", dto);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
