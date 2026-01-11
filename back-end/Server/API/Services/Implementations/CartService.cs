using API.Data;
using API.DTOs.CartDTOs;
using API.DTOs.ProductDTOs;
using API.Models;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations;

public class CartService : ICartService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public CartService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<CartResponseDTO> GetCartAsync(int userId)
    {
        var cartItems = await _db.Carts
            .Where(c => c.UserId == userId && (c.IsDeleted == null || c.IsDeleted == false))
            .Include(c => c.Product)
                .ThenInclude(p => p.Images)
            .Include(c => c.Product)
                .ThenInclude(p => p.Volumes)
            .Include(c => c.Product)
                .ThenInclude(p => p.Notes)
            .ToListAsync();

        var items = new List<CartItemResponseDTO>();
        decimal total = 0;
        int itemCount = 0;

        foreach (var cartItem in cartItems)
        {
            var volume = cartItem.Product.Volumes.FirstOrDefault(v => v.Size == cartItem.Volume);
            if (volume == null) continue;

            // Calculate price with volume-specific discount
            decimal price = volume.Price;
            if (volume.DiscountPercentage > 0)
            {
                price = volume.Price * (1 - volume.DiscountPercentage / 100m);
            }

            var subtotal = price * cartItem.Quantity;
            total += subtotal;
            itemCount += cartItem.Quantity;

            // Map Product to ProductDTO using AutoMapper
            var productDto = _mapper.Map<ProductDTO>(cartItem.Product);

            items.Add(new CartItemResponseDTO
            {
                ProductId = cartItem.ProductId,
                Volume = cartItem.Volume,
                Quantity = cartItem.Quantity,
                Price = price,
                Product = productDto
            });
        }

        return new CartResponseDTO
        {
            Items = items,
            Total = total,
            ItemCount = itemCount
        };
    }

    public async Task<CartResponseDTO> AddItemAsync(int userId, CartItemDTO item)
    {
        // Check if product exists
        var product = await _db.Products
            .Include(p => p.Volumes)
            .FirstOrDefaultAsync(p => p.Id == item.ProductId && (p.IsDeleted == null || p.IsDeleted == false));

        if (product == null)
            throw new KeyNotFoundException($"Product with id {item.ProductId} not found");

        // Check if volume exists
        var volume = product.Volumes.FirstOrDefault(v => v.Size == item.Volume);
        if (volume == null)
            throw new KeyNotFoundException($"Volume {item.Volume}ml not found for product {item.ProductId}");

        // Check stock
        if (volume.Stock < item.Quantity)
            throw new InvalidOperationException($"Insufficient stock. Available: {volume.Stock}, Requested: {item.Quantity}");

        // Check if item already exists in cart
        var existingCartItem = await _db.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId
                && c.ProductId == item.ProductId
                && c.Volume == item.Volume
                && (c.IsDeleted == null || c.IsDeleted == false));

        if (existingCartItem != null)
        {
            // Update quantity
            existingCartItem.Quantity += item.Quantity;
            if (existingCartItem.Quantity > volume.Stock)
                existingCartItem.Quantity = volume.Stock;
            existingCartItem.UpdatedAt = DateTimeOffset.UtcNow;
        }
        else
        {
            // Create new cart item
            var cartItem = new Cart
            {
                UserId = userId,
                ProductId = item.ProductId,
                Volume = item.Volume,
                Quantity = item.Quantity,
                IsDeleted = false,
                CreatedAt = DateTimeOffset.UtcNow
            };
            await _db.Carts.AddAsync(cartItem);
        }

        await _db.SaveChangesAsync();
        return await GetCartAsync(userId);
    }

    public async Task<CartResponseDTO> RemoveItemAsync(int userId, int productId, int volume)
    {
        var cartItem = await _db.Carts
            .FirstOrDefaultAsync(c => c.UserId == userId
                && c.ProductId == productId
                && c.Volume == volume
                && (c.IsDeleted == null || c.IsDeleted == false));

        if (cartItem != null)
        {
            _db.Carts.Remove(cartItem);
            await _db.SaveChangesAsync();
        }

        return await GetCartAsync(userId);
    }

    public async Task<CartResponseDTO> UpdateQuantityAsync(int userId, int productId, int volume, int quantity)
    {
        if (quantity <= 0)
            return await RemoveItemAsync(userId, productId, volume);

        var cartItem = await _db.Carts
            .Include(c => c.Product)
                .ThenInclude(p => p.Volumes)
            .Include(c => c.Product)
                .ThenInclude(p => p.Notes)
            .FirstOrDefaultAsync(c => c.UserId == userId
                && c.ProductId == productId
                && c.Volume == volume
                && (c.IsDeleted == null || c.IsDeleted == false));

        if (cartItem == null)
            throw new KeyNotFoundException("Cart item not found");

        // Check stock
        var productVolume = cartItem.Product.Volumes.FirstOrDefault(v => v.Size == volume);
        if (productVolume == null)
            throw new KeyNotFoundException($"Volume {volume}ml not found for product {productId}");

        if (quantity > productVolume.Stock)
            quantity = productVolume.Stock;

        cartItem.Quantity = quantity;
        cartItem.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    public async Task ClearCartAsync(int userId)
    {
        var cartItems = await _db.Carts
            .Where(c => c.UserId == userId && (c.IsDeleted == null || c.IsDeleted == false))
            .ToListAsync();

        _db.Carts.RemoveRange(cartItems);
        await _db.SaveChangesAsync();
    }
}

