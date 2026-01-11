using API.Data;
using API.DTOs.Pagination;
using API.DTOs.ProductDTOs;
using API.Models;
using API.Services.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services.Implementations;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ProductService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<ProductDTO?> CreateAsync(ProductCreateDTO dto)
    {
        if (dto is null) throw new ArgumentNullException(nameof(dto));

        var product = _mapper.Map<Product>(dto);
        product.IsDeleted = false;

        // Create notes - EF Core will set ProductId automatically via One-to-One relationship
        var notes = CreateNotes(dto.Top, dto.Heart, dto.Base);
        product.Notes = notes;

        try
        {
            await _db.Products.AddAsync(product);
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException dbEx)
        {
            // Get detailed error message
            var innerMessage = dbEx.InnerException?.Message ?? "";
            var fullMessage = $"Failed to save product: {dbEx.Message}";
            if (!string.IsNullOrEmpty(innerMessage))
            {
                fullMessage += $" | Inner Exception: {innerMessage}";
            }
            throw new Exception(fullMessage, dbEx);
        }

        return _mapper.Map<ProductDTO>(await GetProductWithIncludesAsync(product.Id));
    }

    public async Task<ProductDTO?> UpdateAsync(int id, ProductUpdateDTO dto)
    {
        if (dto is null) throw new ArgumentNullException(nameof(dto));

        var product = await GetProductWithIncludesAsync(id);
        if (product == null || product.IsDeleted.GetValueOrDefault())
            throw new NullReferenceException($"Product with id {id} not found!");

        // Update basic product info
        _mapper.Map(dto, product);
        product.UpdatedAt = DateTimeOffset.UtcNow;

        // Update notes
        UpdateNotes(product, id, dto.Top, dto.Heart, dto.Base);

        // Save basic updates first
        await _db.SaveChangesAsync();

        // Now handle images and volumes separately with clean context
        await UpdateImagesAndVolumesAsync(id, dto.Images, dto.Volumes);

        return _mapper.Map<ProductDTO>(await GetProductWithIncludesAsync(id));
    }


    public async Task RecoverAsync(int id)
    {
        var product = await CheckProductAsync(id, includeDeleted: true);
        if (!product.IsDeleted.GetValueOrDefault())
            throw new InvalidOperationException("Product is not deleted");

        product.IsDeleted = false;
        product.DeletedAt = null;
        await _db.SaveChangesAsync();
    }

    public async Task RemoveAsync(int id)
    {
        var product = await CheckProductAsync(id, includeDeleted: true);
        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
    }

    public async Task SoftDeleteAsync(int id)
    {
        var product = await CheckProductAsync(id);
        product.IsDeleted = true;
        product.DeletedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task<bool> UpdateFeaturedStatusAsync(int id, bool featured)
    {
        var product = await CheckProductAsync(id);
        product.Featured = featured;
        product.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();
        return product.Featured;
    }


    // User

    public async Task<PaginationListDTO<ProductDTO>> GetAllAsync(ProductRequestDTO request)
    {
        var query = BuildQuery(request.Search, request.Featured);
        var totalCount = await query.CountAsync();

        var products = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ApplyIncludes()
            .ToListAsync();

        return new PaginationListDTO<ProductDTO>(
            _mapper.Map<List<ProductDTO>>(products),
            new PaginationMeta(request.Page, request.PageSize, totalCount));
    }

    public async Task<ProductDTO?> Getasync(string brand, string name)
    {
        var query = BuildQuery(null);
        if (!string.IsNullOrWhiteSpace(brand)) query = query.Where(p => p.Brand == brand);
        if (!string.IsNullOrWhiteSpace(name)) query = query.Where(p => p.Name == name);

        var product = await query.ApplyIncludes().FirstOrDefaultAsync();
        return product == null ? null : _mapper.Map<ProductDTO>(product);
    }

    public async Task<ProductDTO?> GetByIdAsync(int id)
    {
        var product = await BuildQuery(null)
            .Where(p => p.Id == id)
            .ApplyIncludes()
            .FirstOrDefaultAsync();

        return product == null ? null : _mapper.Map<ProductDTO>(product);
    }

    private async Task<Product> CheckProductAsync(int id, bool includeDeleted = false)
    {
        var product = await _db.Products.FirstOrDefaultAsync(x => x.Id == id);
        if (product == null || (!includeDeleted && product.IsDeleted.GetValueOrDefault()))
            throw new NullReferenceException($"Product with id {id} not found!");
        return product;
    }

    private async Task<Product?> GetProductWithIncludesAsync(int id) =>
        await _db.Products
            .Include(p => p.Images)
            .Include(p => p.Volumes)
            .Include(p => p.Notes)
            .FirstOrDefaultAsync(p => p.Id == id);

    private IQueryable<Product> BuildQuery(string? search, bool? featured = null)
    {
        var query = _db.Products.Where(p => p.IsDeleted != true).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search.Trim()) || p.Brand.Contains(search.Trim()));
        if (featured.HasValue)
            query = query.Where(p => p.Featured == featured.Value);
        return query;
    }

    private ProductNotes CreateNotes(List<string>? top, List<string>? heart, List<string>? @base) => new()
    {
        Top = JoinNotes(top),
        Heart = JoinNotes(heart),
        Base = JoinNotes(@base),
        CreatedAt = DateTimeOffset.UtcNow
    };

    private void UpdateNotes(Product product, int productId, List<string>? top, List<string>? heart, List<string>? @base)
    {
        var now = DateTimeOffset.UtcNow;
        if (product.Notes == null)
        {
            product.Notes = CreateNotes(top, heart, @base);
            product.Notes.ProductId = productId;
            _db.ProductNotes.Add(product.Notes);
        }
        else
        {
            product.Notes.Top = JoinNotes(top);
            product.Notes.Heart = JoinNotes(heart);
            product.Notes.Base = JoinNotes(@base);
            product.Notes.UpdatedAt = now;
            _db.Entry(product.Notes).State = EntityState.Modified;
        }
    }

    private async Task UpdateImagesAndVolumesAsync(int productId,
        ICollection<ProductImageUpdateDTO>? images, ICollection<ProductVolumeUpdateDTO>? volumes)
    {
        var now = DateTimeOffset.UtcNow;

        // Delete using ExecuteDelete (no tracking, direct SQL)
        await _db.ProductImages
            .Where(i => i.ProductId == productId)
            .ExecuteDeleteAsync();

        await _db.ProductVolume
            .Where(v => v.ProductId == productId)
            .ExecuteDeleteAsync();

        // Clear any tracked entities
        _db.ChangeTracker.Clear();

        // Add new images as completely new entities
        if (images != null && images.Any())
        {
            var newImages = new List<ProductImage>();
            foreach (var imageDto in images)
            {
                newImages.Add(new ProductImage
                {
                    ProductId = productId,
                    Url = imageDto.Url,
                    PublicId = imageDto.PublicId,
                    Sort = imageDto.Sort,
                    CreatedAt = now
                });
            }
            await _db.ProductImages.AddRangeAsync(newImages);
        }

        // Add new volumes as completely new entities
        if (volumes != null && volumes.Any())
        {
            var newVolumes = new List<ProductVolume>();
            foreach (var volumeDto in volumes)
            {
                newVolumes.Add(new ProductVolume
                {
                    ProductId = productId,
                    Size = volumeDto.Size,
                    Price = volumeDto.Price,
                    Stock = volumeDto.Stock,
                    DiscountPercentage = volumeDto.DiscountPercentage,
                    CreatedAt = now
                });
            }
            await _db.ProductVolume.AddRangeAsync(newVolumes);
        }

        // Save new entities
        await _db.SaveChangesAsync();
    }

    private static string? JoinNotes(List<string>? notes) =>
        notes != null && notes.Any() ? string.Join(", ", notes) : null;
}

internal static class ProductQueryExtensions
{
    public static IQueryable<Product> ApplyIncludes(this IQueryable<Product> query) =>
        query.Include(p => p.Images).Include(p => p.Volumes).Include(p => p.Notes);
}
