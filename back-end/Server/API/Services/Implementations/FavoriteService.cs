using API.Data;
using API.Models;
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations;

public class FavoriteService : IFavoriteService
{
    private readonly AppDbContext _db;

    public FavoriteService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<int>> GetFavoritesAsync(int userId)
    {
        var favorites = await _db.Favorites
            .Where(f => f.UserId == userId && (f.IsDeleted == null || f.IsDeleted == false))
            .Select(f => f.ProductId)
            .ToListAsync();

        return favorites;
    }

    public async Task<List<int>> AddFavoriteAsync(int userId, int productId)
    {
        // Check if product exists
        var product = await _db.Products
            .FirstOrDefaultAsync(p => p.Id == productId && (p.IsDeleted == null || p.IsDeleted == false));
        
        if (product == null)
            throw new KeyNotFoundException($"Product with id {productId} not found");

        // Check if favorite already exists
        var existingFavorite = await _db.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId 
                && f.ProductId == productId
                && (f.IsDeleted == null || f.IsDeleted == false));

        if (existingFavorite == null)
        {
            var favorite = new Favorite
            {
                UserId = userId,
                ProductId = productId,
                IsDeleted = false,
                CreatedAt = DateTimeOffset.UtcNow
            };
            await _db.Favorites.AddAsync(favorite);
            await _db.SaveChangesAsync();
        }

        return await GetFavoritesAsync(userId);
    }

    public async Task<List<int>> RemoveFavoriteAsync(int userId, int productId)
    {
        var favorite = await _db.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId 
                && f.ProductId == productId
                && (f.IsDeleted == null || f.IsDeleted == false));

        if (favorite != null)
        {
            _db.Favorites.Remove(favorite);
            await _db.SaveChangesAsync();
        }

        return await GetFavoritesAsync(userId);
    }

    public async Task<List<int>> ToggleFavoriteAsync(int userId, int productId)
    {
        var favorite = await _db.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId 
                && f.ProductId == productId
                && (f.IsDeleted == null || f.IsDeleted == false));

        if (favorite != null)
        {
            // Remove favorite
            _db.Favorites.Remove(favorite);
        }
        else
        {
            // Check if product exists
            var product = await _db.Products
                .FirstOrDefaultAsync(p => p.Id == productId && (p.IsDeleted == null || p.IsDeleted == false));
            
            if (product == null)
                throw new KeyNotFoundException($"Product with id {productId} not found");

            // Add favorite
            var newFavorite = new Favorite
            {
                UserId = userId,
                ProductId = productId,
                IsDeleted = false,
                CreatedAt = DateTimeOffset.UtcNow
            };
            await _db.Favorites.AddAsync(newFavorite);
        }

        await _db.SaveChangesAsync();
        return await GetFavoritesAsync(userId);
    }
}

