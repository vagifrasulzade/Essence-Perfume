using API.DTOs.OrderDTOs;
using API.DTOs.Pagination;

namespace API.Services.Interfaces;

public interface IOrderService
{
    // User
    Task<OrderDTO?> CreateAsync(OrderCreateDTO dto, int userId);
    Task<List<OrderDTO>> GetUserOrdersAsync(int userId);
    Task<OrderDTO?> GetUserOrderByIdAsync(string orderId, int userId);

    // Admin
    Task<PaginationListDTO<OrderDTO>> GetAllAsync(OrderRequestDTO request);
    Task<OrderDTO?> GetByIdAsync(string orderId);
    Task UpdateStatusAsync(string orderId, OrderUpdateDTO dto);
    Task UpdateShippingAsync(string orderId, OrderShippingUpdateDTO dto);
    Task SoftDeleteAsync(string orderId);
    Task RecoverAsync(string orderId);
    Task RemoveAsync(string orderId);
}
