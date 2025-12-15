using API.DTOs.OrderDTOs;
using API.Models;
using AutoMapper;

namespace API.Mapper;

public class OrderMP : Profile
{
    public OrderMP()
    {
        // Order <-> OrderDTO
        CreateMap<Order, OrderDTO>().ReverseMap();

        // OrderItem <-> OrderItemDTO
        CreateMap<OrderItem, OrderItemDTO>().ReverseMap();

        // OrderShipping <-> OrderShippingDTO
        CreateMap<OrderShipping, OrderShippingDTO>().ReverseMap();

        // OrderShippingCreateDTO -> OrderShipping
        CreateMap<OrderShippingCreateDTO, OrderShipping>()
            .ForMember(dest => dest.Zip, opt => opt.MapFrom(src => src.ZipCode))
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.Order, opt => opt.Ignore());

        // OrderShippingUpdateDTO -> OrderShipping
        CreateMap<OrderShippingUpdateDTO, OrderShipping>()
            .ForMember(dest => dest.Zip, opt => opt.MapFrom(src => src.ZipCode))
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.Order, opt => opt.Ignore());
    }
}