namespace API.Services.Interfaces;

public interface IFavoriteService
{
    Task<List<int>> GetFavoritesAsync(int userId);
    Task<List<int>> AddFavoriteAsync(int userId, int productId);
    Task<List<int>> RemoveFavoriteAsync(int userId, int productId);
    Task<List<int>> ToggleFavoriteAsync(int userId, int productId);
}

