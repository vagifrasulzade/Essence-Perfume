using API.DTOs.AuthDTOs;
using API.Models;
using AutoMapper;

namespace API.Mapper;

public class AuthMP : Profile
{
    public AuthMP()
    {
        CreateMap<User, UserDTO>();
        CreateMap<CreateUserDTO, User>().ReverseMap();
        
        CreateMap<UpdateUserDTO, User>();
            
    }
}
