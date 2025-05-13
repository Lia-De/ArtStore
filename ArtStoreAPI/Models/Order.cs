using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArtStoreAPI.Models;

public class Order
{
    [Key] public int OrderId { get; set; }
    [ForeignKey("ShoppingBasketId")] public required int ShoppingBasketId { get; set; }
    [ForeignKey("ShopCustomerId")] public required int ShopCustomerId { get; set; }
    public decimal TotalCost { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ShippedAt { get; set; }
    public decimal ShippingCost { get; set; }

    public Order()
    {
        
    }
    public Order(ShoppingBasket basket, decimal shippingCost)
    {
        ShoppingBasketId = basket.ShoppingBasketId;
        ShopCustomerId = basket.CustomerId;
        ShippingCost = shippingCost;
        TotalCost = basket.TotalPrice + shippingCost;
    }
}
