using API.DTOs.ProductDTOs;

namespace API.DTOs.CartDTOs;

public class CartItemDTO
{
    public int ProductId { get; set; }
    public int Volume { get; set; }
    public int Quantity { get; set; }
}

public class CartResponseDTO
{
    public List<CartItemResponseDTO> Items { get; set; } = new();
    public decimal Total { get; set; }
    public int ItemCount { get; set; }
}

public class CartItemResponseDTO
{
    public int ProductId { get; set; }
    public ProductDTO Product { get; set; } = default!;
    public int Volume { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
}

public class CartUpdateDTO
{
    public int ProductId { get; set; }
    public int Volume { get; set; }
    public int Quantity { get; set; }
}

