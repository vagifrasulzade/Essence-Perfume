using API.DTOs.CartDTOs;

namespace API.Services.Interfaces;

public interface ICartService
{
    Task<CartResponseDTO> GetCartAsync(int userId);
    Task<CartResponseDTO> AddItemAsync(int userId, CartItemDTO item);
    Task<CartResponseDTO> RemoveItemAsync(int userId, int productId, int volume);
    Task<CartResponseDTO> UpdateQuantityAsync(int userId, int productId, int volume, int quantity);
    Task ClearCartAsync(int userId);
}

