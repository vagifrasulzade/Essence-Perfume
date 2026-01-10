namespace API.DTOs.ProductDTOs;

public class ProductUpdateDTO
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Brand { get; set; }
    public API.Models.Enums.Gender Gender { get; set; }
    public int Reviews { get; set; }
    public double Rating { get; set; }
    public bool Featured { get; set; }
    public decimal DiscountPercentage { get; set; } = 0;

    // Product Notes
    public List<string> Top { get; set; } = new();
    public List<string> Heart { get; set; } = new();
    public List<string> Base { get; set; } = new();

    // Images
    public ICollection<ProductImageUpdateDTO> Images { get; set; } = new List<ProductImageUpdateDTO>();

    // Volumes
    public ICollection<ProductVolumeUpdateDTO> Volumes { get; set; } = new List<ProductVolumeUpdateDTO>();
}

public class ProductImageUpdateDTO
{
    public int ProductId { get; set; }
    public string Url { get; set; } = default!;
    public string? PublicId { get; set; }
    public int Sort { get; set; }
}

public class ProductVolumeUpdateDTO
{
    public int ProductId { get; set; }
    public int Size { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}
