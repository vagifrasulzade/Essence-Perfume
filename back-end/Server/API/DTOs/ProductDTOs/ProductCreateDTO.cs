using API.Models.Entity;
using API.Models.Enums;

namespace API.DTOs.ProductDTOs;

public class ProductCreateDTO
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public string Brand { get; set; }
    public Gender Gender { get; set; }

    public int Reviews { get; set; }

    public double Rating { get; set; }
    public bool Featured { get; set; }
    public decimal DiscountPercentage { get; set; } = 0;

    // Product Notes
    public List<string> Top { get; set; } = new();
    public List<string> Heart { get; set; } = new();
    public List<string> Base { get; set; } = new();

    // Images
    public ICollection<ProductImageCreateDTO> Images { get; set; } = new List<ProductImageCreateDTO>();

    // Volumes
    public ICollection<ProductVolumeCreateDTO> Volumes { get; set; } = new List<ProductVolumeCreateDTO>();


}

public class ProductImageCreateDTO
{
    public string Url { get; set; } = default!;

    public string? PublicId { get; set; }
    public int Sort { get; set; }

}

public class ProductVolumeCreateDTO
{
    public int Size { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public decimal DiscountPercentage { get; set; } = 0;
}