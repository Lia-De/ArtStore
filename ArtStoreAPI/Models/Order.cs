using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArtStoreAPI.Models;

public class Order
{
    [Key] public int OrderId { get; set; }
    [ForeignKey("ShoppingBasketId")] public required int ShoppingBasketId { get; set; }
    [ForeignKey("ShopCustomerId")] public required int ShopCustomerId { get; set; }
    public decimal TotalCost { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime ShippedAt { get; set; }
    public decimal ShippingCost { get; set; }

    public Order()
    {
        
    }
    public Order(ShoppingBasket basket, int customerId, decimal shipping)
    {
        DateTime timestamp = DateTime.UtcNow;
        
        CreatedAt = timestamp;
        
        ShoppingBasketId = basket.ShoppingBasketId;
        basket.Status = Status.Purchased;
        basket.UpdatedAt = timestamp;
                
        ShopCustomerId = customerId;

        ShippingCost = shipping;
        TotalCost = basket.TotalPrice + shipping;
    }
}
