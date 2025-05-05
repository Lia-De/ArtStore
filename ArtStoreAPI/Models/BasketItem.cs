using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArtStoreAPI.Models;

public class BasketItem
{
    [Key] public int BasketItemId { get; set; }
    [ForeignKey("ShoppingBasketId")] public int ShoppingBasketId { get; set; }
    [ForeignKey("InventoryId")] public int InventoryId { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; } = 1;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public BasketItem(int shoppingBasketId, int inventoryId, decimal price)
    {
        ShoppingBasketId = shoppingBasketId;
        InventoryId = inventoryId;
        Price = price;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
    
}
