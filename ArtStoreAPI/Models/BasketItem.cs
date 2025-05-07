using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArtStoreAPI.Models;

public class BasketItem(int shoppingBasketId, int inventoryId, decimal price)
{
    [Key] public int BasketItemId { get; set; }
    [ForeignKey("ShoppingBasketId")] public int ShoppingBasketId { get; set; } = shoppingBasketId;
    [ForeignKey("InventoryId")] public int InventoryId { get; set; } = inventoryId;
    public decimal Price { get; set; } = price;
    public int Quantity { get; set; } = 1;
    public long CreatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    public long UpdatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
}
