using API.DTOs.Pagination;
using API.DTOs.ProductDTOs;

namespace API.Services.Interfaces;

public interface IProductService
{
    //Admin
    Task<ProductDTO?>CreateAsync(ProductCreateDTO dto);
    Task<ProductDTO?>UpdateAsync(int id, ProductUpdateDTO dto);

    
    Task<bool> UpdateFeaturedStatusAsync(int id, bool featured);

    Task SoftDeleteAsync(int id);

    Task RecoverAsync(int id);

    Task RemoveAsync(int id);


    //User

    Task<PaginationListDTO<ProductDTO>> GetAllAsync(ProductRequestDTO request);
    Task<ProductDTO?>Getasync(string brand,string name);
    Task<ProductDTO?> GetByIdAsync(int id);




}
