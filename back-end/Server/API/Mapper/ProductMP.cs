using API.DTOs.ProductDTOs;
using API.Models;
using AutoMapper;

namespace API.Mapper;

public class ProductMP : Profile
{
    public ProductMP()
    {
        // ProductImage <-> ProductImageDTO
        CreateMap<ProductImage, ProductImageDTO>().ReverseMap();

        // ProductVolume <-> ProductVolumeDTO
        CreateMap<ProductVolume, ProductVolumeDTO>().ReverseMap();

        // ProductImageCreateDTO -> ProductImage
        CreateMap<ProductImageCreateDTO, ProductImage>()
            .AfterMap((src, dest, context) =>
            {
                if (context.Items.TryGetValue("ProductId", out var productId))
                    dest.ProductId = (int)productId;
            });

        // ProductVolumeCreateDTO -> ProductVolume
        CreateMap<ProductVolumeCreateDTO, ProductVolume>()
            .AfterMap((src, dest, context) =>
            {
                if (context.Items.TryGetValue("ProductId", out var productId))
                    dest.ProductId = (int)productId;
            });

        // ProductCreateDTO -> Product
        CreateMap<ProductCreateDTO, Product>()
            .ForMember(dest => dest.Notes, opt => opt.Ignore())
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Volumes, opt => opt.Ignore())
            .AfterMap((src, dest) =>
            {
                var now = DateTimeOffset.UtcNow;
                dest.CreatedAt = now;
                dest.Images = src.Images?.Select(img => new ProductImage
                {
                    Url = img.Url,
                    PublicId = img.PublicId,
                    Sort = img.Sort,
                    CreatedAt = now
                }).ToList() ?? new List<ProductImage>();
                dest.Volumes = src.Volumes?.Select(vol => new ProductVolume
                {
                    Size = vol.Size,
                    Price = vol.Price,
                    Stock = vol.Stock,
                    CreatedAt = now
                }).ToList() ?? new List<ProductVolume>();
            });

        // Product -> ProductDTO
        CreateMap<Product, ProductDTO>()
            .ForMember(dest => dest.Top, opt => opt.MapFrom(src => SplitNotes(src.Notes.Top)))
            .ForMember(dest => dest.Heart, opt => opt.MapFrom(src => SplitNotes(src.Notes.Heart)))
            .ForMember(dest => dest.Base, opt => opt.MapFrom(src => SplitNotes(src.Notes.Base)));

        // ProductUpdateDTO -> Product
        CreateMap<ProductUpdateDTO, Product>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Notes, opt => opt.Ignore())
            .ForMember(dest => dest.Images, opt => opt.Ignore())
            .ForMember(dest => dest.Volumes, opt => opt.Ignore())
            .AfterMap((src, dest) => dest.UpdatedAt = DateTimeOffset.UtcNow);

        // ProductImageUpdateDTO -> ProductImage
        CreateMap<ProductImageUpdateDTO, ProductImage>()
            .AfterMap((src, dest) => dest.UpdatedAt = DateTimeOffset.UtcNow);

        // ProductVolumeUpdateDTO -> ProductVolume
        CreateMap<ProductVolumeUpdateDTO, ProductVolume>()
            .AfterMap((src, dest) => dest.UpdatedAt = DateTimeOffset.UtcNow);
    }

    private static List<string> SplitNotes(string? notes) =>
        string.IsNullOrEmpty(notes)
            ? new List<string>()
            : notes.Split(", ", StringSplitOptions.RemoveEmptyEntries).ToList();
}