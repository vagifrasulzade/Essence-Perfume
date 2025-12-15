using API.Models.Enums;

namespace API.DTOs.ProductDTOs;

public class ProductDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string Brand { get; set; } = default!;
    public Gender Gender { get; set; }
    public int Reviews { get; set; }
    public double Rating { get; set; }
    public bool Featured { get; set; }

    // Notes
    public List<string> Top { get; set; } = new();
    public List<string> Heart { get; set; } = new();
    public List<string> Base { get; set; } = new();

    // Images
    public List<ProductImageDTO> Images { get; set; } = new();

    // Volumes
    public List<ProductVolumeDTO> Volumes { get; set; } = new();

 
}

public class ProductImageDTO
{
    public int ProductId { get; set; }
    public string Url { get; set; } = default!;
    public string? PublicId { get; set; }
    public int Sort { get; set; }
}

public class ProductVolumeDTO
{
    public int ProductId { get; set; }

    public int Size { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}

