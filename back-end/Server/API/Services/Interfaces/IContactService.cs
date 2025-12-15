using API.DTOs.ContactDTOs;
using API.DTOs.Pagination;

namespace API.Services.Interfaces;

public interface IContactService
{
    // User

    Task<ContactDTO?> CreateAsync(ContactCreateDTO dto);

    // Admin
    Task<PaginationListDTO<ContactDTO>> GetAllAsync(ContactRequestDTO request);

    Task<ContactDTO?> GetAsync(string? fullname,string?email,string?phone);

    Task<ContactDTO?> GetByIdAsync(int id);

    

    Task UpdateAsync(int id, ContactUpdateDTO dto);


    Task SoftDeleteAsync(int id);

    Task RecoverAsync(int id);

    Task RemoveAsync(int id);



}
