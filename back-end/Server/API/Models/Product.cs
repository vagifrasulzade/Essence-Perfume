using API.Models.Entity;
using API.Models.Enums;

namespace API.Models;

public class Product : BaseEntity
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public string Brand { get; set; }
    public Gender Gender { get; set; }

    public int Reviews { get; set; }

    public double Rating { get; set; }
    public bool Featured { get; set; }

    public ProductNotes Notes { get; set; }

    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVolume> Volumes { get; set; } = new List<ProductVolume>();

}
