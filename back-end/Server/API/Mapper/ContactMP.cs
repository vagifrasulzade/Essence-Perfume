using API.DTOs.ContactDTOs;
using API.Models;
using AutoMapper;

namespace API.Mapper;

public class ContactMP : Profile
{
    public ContactMP()
    {
        CreateMap<ContactCreateDTO, ContactMessage>().ReverseMap();
        CreateMap<ContactUpdateDTO, ContactMessage>();
        
        CreateMap<ContactMessage, ContactDTO>()
            .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.CreatedAt));
    }
}
