using API.Data;
using API.DTOs.ContactDTOs;
using API.DTOs.Pagination;
using API.Models;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations;

public class ContactService : IContactService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ContactService(AppDbContext db, IMapper mapper)
    {
        _db = db; 
        _mapper = mapper;
    }


    // User 
    public async Task<ContactDTO?> CreateAsync(ContactCreateDTO dto)
    {
        if (dto is null) throw new ArgumentNullException(nameof(dto));

        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new ArgumentNullException(nameof(dto.Email), "Email is required!");

        var contact = _mapper.Map<ContactMessage>(dto);
        contact.CreatedAt = DateTimeOffset.UtcNow;

        await _db.ContactMessages.AddAsync(contact);
        await _db.SaveChangesAsync();
        return _mapper.Map<ContactDTO>(contact);
    }

    // Admin

    public async Task<PaginationListDTO<ContactDTO>> GetAllAsync(ContactRequestDTO request)
    { 
       var query = _db.ContactMessages.Where(c => c.IsDeleted != true).AsQueryable();
       
       if(!string.IsNullOrWhiteSpace(request.Search))
       {
           var search = request.Search.Trim();
           query = query.Where(c => 
               (c.FullName != null && c.FullName.Contains(search)) || 
               (c.Email != null && c.Email.Contains(search)) || 
               (c.Phone != null && c.Phone.Contains(search)) || 
               (c.Subject != null && c.Subject.Contains(search)) || 
               (c.Message != null && c.Message.Contains(search)));
       }
       
       var totalCount = await query.CountAsync(); 
       var contacts = await query.Skip((request.Page - 1) * request.PageSize).Take(request.PageSize).ToListAsync();
       var dtos = _mapper.Map<List<ContactDTO>>(contacts);
       
       return new PaginationListDTO<ContactDTO>(dtos, new PaginationMeta(request.Page, request.PageSize, totalCount));
    }

    public async Task<ContactDTO?> GetAsync(string fullname, string email,string phone)
    {
        var query = _db.ContactMessages.Where(c => c.IsDeleted != true).AsQueryable();
        if(!string.IsNullOrWhiteSpace(fullname))
        {
            query = query.Where(c => c.FullName == fullname);
        }
        if(!string.IsNullOrWhiteSpace(email))
        {
            query = query.Where(c => c.Email == email);
        }
        if(!string.IsNullOrWhiteSpace(phone))
        {
            query = query.Where(c => c.Phone == phone);
        }
        var contact = await query.FirstOrDefaultAsync();
        if(contact == null) return null;
        
        return _mapper.Map<ContactDTO>(contact);
    }

    public async Task<ContactDTO?> GetByIdAsync(int id)
    {
        var contact = await CheckContactIdAsync(id);
        if(contact == null) return null;
        return _mapper.Map<ContactDTO>(contact);
    }




   
    public async Task SoftDeleteAsync(int id)
    {
        var contact = await CheckContactIdAsync(id);
        
        if (contact.IsDeleted == true)
            throw new InvalidOperationException("Contact message is already deleted");

        contact.IsDeleted = true;
        contact.DeletedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
    }

    
    public async Task RecoverAsync(int id)
    {
        var contact = await CheckContactIdAsync(id, includeDeleted: true);
        
        if (contact.IsDeleted != true)
            throw new InvalidOperationException("Contact message is not deleted");

        contact.IsDeleted = false;
        contact.DeletedAt = null;

        await _db.SaveChangesAsync();
    }

   
    public async Task RemoveAsync(int id)
    {
        var contact = await _db.ContactMessages.FindAsync(id);

        if (contact == null)
            throw new Exception("Contact message not found");

        _db.ContactMessages.Remove(contact);
        await _db.SaveChangesAsync();
        // Identity reset is now handled automatically in AppDbContext.SaveChangesAsync
    }

    
    public async Task UpdateAsync(int id, ContactUpdateDTO dto)
    {
        if(dto is null) throw new ArgumentNullException(nameof(dto));
        
        var contact = await CheckContactIdAsync(id);
        
        _mapper.Map(dto, contact);
        contact.UpdatedAt = DateTimeOffset.UtcNow;
        
        await _db.SaveChangesAsync();
    }

    //private async Task<bool?> EmailExit(string email)
    //{
    //    if (string.IsNullOrWhiteSpace(email))
    //        return null;

    //    return await _db.ContactMessages.AnyAsync(c => c.Email == email);
    //}

    private async Task<ContactMessage> CheckContactIdAsync(int id, bool includeDeleted = false)
    {
        var contact = await _db.ContactMessages.FirstOrDefaultAsync(c => c.Id == id);

        if (contact is null || (!includeDeleted && contact.IsDeleted.GetValueOrDefault()))
            throw new NullReferenceException($"Contact message with id {id} not found!");

        return contact;
    }

    
}
