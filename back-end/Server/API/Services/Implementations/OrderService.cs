using API.Data;
using API.DTOs.OrderDTOs;
using API.DTOs.Pagination;
using API.Models;
using API.Models.Enums;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public OrderService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<OrderDTO?> CreateAsync(OrderCreateDTO dto, int userId)
    {
        if (dto is null) throw new ArgumentNullException(nameof(dto));

        var now = DateTimeOffset.UtcNow;
        var orderId = $"ORD-{Guid.NewGuid()}";

        // Trim shipping fields before creating order
        var firstName = dto.Shipping.FirstName?.Trim() ?? "";
        var lastName = dto.Shipping.LastName?.Trim() ?? "";
        var email = dto.Shipping.Email?.Trim() ?? "";

        if (string.IsNullOrWhiteSpace(firstName)) throw new Exception("FirstName is required");
        if (string.IsNullOrWhiteSpace(lastName)) throw new Exception("LastName is required");
        if (string.IsNullOrWhiteSpace(email)) throw new Exception("Email is required");

        var order = new Order
        {
            Id = orderId,
            UserId = userId,
            CustomerName = $"{firstName} {lastName}".Trim(),
            CustomerEmail = email,
            Date = DateTime.UtcNow,
            Status = OrderStatus.Pending,
            CreatedAt = now
        };

        decimal total = 0;
        foreach (var itemDto in dto.Items)
        {
            var product = await _db.Products
                .Include(p => p.Volumes)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == itemDto.ProductId);

            if (product == null) throw new Exception($"Product {itemDto.ProductId} not found");

            // Volume is the Size in ml (e.g., 50, 100), not the ProductVolume.Id
            var volume = product.Volumes.FirstOrDefault(v => v.Size == itemDto.Volume);
            if (volume == null) throw new Exception($"Volume {itemDto.Volume}ml not found for product {itemDto.ProductId}");
            if (volume.Stock < itemDto.Quantity) throw new Exception("Insufficient stock");

            volume.Stock -= itemDto.Quantity;

            // Calculate price with volume-specific discount
            decimal price = volume.Price;
            if (volume.DiscountPercentage > 0)
            {
                price = volume.Price * (1 - volume.DiscountPercentage / 100m);
            }

            total += price * itemDto.Quantity;

            var firstImage = product.Images.OrderBy(img => img.Sort).FirstOrDefault()?.Url ?? "";

            // Ensure all required string fields are not null or empty
            if (string.IsNullOrWhiteSpace(product.Name))
                throw new Exception($"Product {itemDto.ProductId} has no name");
            if (string.IsNullOrWhiteSpace(product.Brand))
                throw new Exception($"Product {itemDto.ProductId} has no brand");

            order.Items.Add(new OrderItem
            {
                OrderId = orderId,
                ProductId = itemDto.ProductId,
                Name = product.Name.Trim(),
                Brand = product.Brand.Trim(),
                Volume = volume.Size.ToString(),
                Price = price,
                Quantity = itemDto.Quantity,
                Image = string.IsNullOrWhiteSpace(firstImage) ? "" : firstImage.Trim(),
                CreatedAt = now
            });
        }

        order.Total = total;

        // Create OrderShipping manually to ensure all required fields are set
        // Trim all string fields to avoid whitespace issues
        order.Shipping = new OrderShipping
        {
            OrderId = orderId,
            Address = dto.Shipping.Address?.Trim() ?? throw new Exception("Address is required"),
            City = dto.Shipping.City?.Trim() ?? throw new Exception("City is required"),
            State = dto.Shipping.City?.Trim() ?? throw new Exception("City is required"), // Use City as State
            Zip = dto.Shipping.ZipCode?.Trim() ?? throw new Exception("ZipCode is required"),
            Country = dto.Shipping.Country?.Trim() ?? throw new Exception("Country is required"),
            CreatedAt = now
        };

        // Ensure Order entity has all required fields set
        if (string.IsNullOrWhiteSpace(order.CustomerName))
            throw new Exception("CustomerName is required");
        if (string.IsNullOrWhiteSpace(order.CustomerEmail))
            throw new Exception("CustomerEmail is required");

        await _db.Orders.AddAsync(order);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException dbEx)
        {
            // Log the full exception for debugging
            var innerMessage = dbEx.InnerException?.Message ?? "";
            throw new Exception($"Failed to save order: {dbEx.Message}. Inner: {innerMessage}", dbEx);
        }

        return await GetByIdAsync(order.Id);
    }

    public async Task<PaginationListDTO<OrderDTO>> GetAllAsync(OrderRequestDTO request)
    {
        var query = _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Shipping)
            .Where(o => o.IsDeleted != true)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim();
            query = query.Where(o => o.Id.Contains(search) || o.CustomerName.Contains(search) || o.CustomerEmail.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<OrderStatus>(request.Status, true, out var status))
            query = query.Where(o => o.Status == status);

        if (request.UserId.HasValue)
            query = query.Where(o => o.UserId == request.UserId.Value);

        var totalCount = await query.CountAsync();
        var orders = await query.OrderByDescending(o => o.Date)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return new PaginationListDTO<OrderDTO>(_mapper.Map<List<OrderDTO>>(orders),
            new PaginationMeta(request.Page, request.PageSize, totalCount));
    }

    public async Task<OrderDTO?> GetByIdAsync(string orderId)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Shipping)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.IsDeleted != true);

        return order == null ? null : _mapper.Map<OrderDTO>(order);
    }

    public async Task<OrderDTO?> GetUserOrderByIdAsync(string orderId, int userId)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Shipping)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId && o.IsDeleted != true);

        return order == null ? null : _mapper.Map<OrderDTO>(order);
    }

    public async Task<List<OrderDTO>> GetUserOrdersAsync(int userId)
    {
        var orders = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Shipping)
            .Where(o => o.UserId == userId && o.IsDeleted != true)
            .OrderByDescending(o => o.Date)
            .ToListAsync();

        return _mapper.Map<List<OrderDTO>>(orders);
    }

    public async Task UpdateStatusAsync(string orderId, OrderUpdateDTO dto)
    {
        if (dto is null) throw new ArgumentNullException(nameof(dto));
        var order = await CheckOrderAsync(orderId);
        order.Status = dto.Status;
        order.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task UpdateShippingAsync(string orderId, OrderShippingUpdateDTO dto)
    {
        if (dto is null) throw new ArgumentNullException(nameof(dto));
        var order = await CheckOrderAsync(orderId);
        _mapper.Map(dto, order.Shipping);
        order.Shipping.Zip = dto.ZipCode;
        order.Shipping.State = dto.City;
        order.CustomerName = $"{dto.FirstName} {dto.LastName}";
        order.CustomerEmail = dto.Email;
        order.Shipping.UpdatedAt = DateTimeOffset.UtcNow;
        order.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task SoftDeleteAsync(string orderId)
    {
        var order = await CheckOrderAsync(orderId);
        if (order.IsDeleted == true) throw new InvalidOperationException("Order already deleted");
        order.IsDeleted = true;
        order.DeletedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task RecoverAsync(string orderId)
    {
        var order = await CheckOrderAsync(orderId, includeDeleted: true);
        if (order.IsDeleted != true) throw new InvalidOperationException("Order not deleted");
        order.IsDeleted = false;
        order.DeletedAt = null;
        await _db.SaveChangesAsync();
    }

    public async Task RemoveAsync(string orderId)
    {
        var order = await _db.Orders.Include(o => o.Items).Include(o => o.Shipping)
            .FirstOrDefaultAsync(o => o.Id == orderId);
        if (order == null) throw new Exception("Order not found");
        _db.OrderItems.RemoveRange(order.Items);
        _db.OrderShippings.Remove(order.Shipping);
        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();
    }

    private async Task<Order> CheckOrderAsync(string orderId, bool includeDeleted = false)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .Include(o => o.Shipping)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null || (!includeDeleted && order.IsDeleted.GetValueOrDefault()))
            throw new NullReferenceException($"Order with id {orderId} not found!");

        return order;
    }
}
