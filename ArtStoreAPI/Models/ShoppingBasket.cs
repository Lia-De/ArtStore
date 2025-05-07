using System.ComponentModel.DataAnnotations;
namespace ArtStoreAPI.Models;

public class ShoppingBasket
{
    [Key] public int ShoppingBasketId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public List<BasketItem> BasketItems { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public decimal TotalPrice { get; set; }
    public Status Status { get; set; } = Status.Active;

    public void AddToBasket(ArtStoreInventory inventory)
    {
        if (inventory.Quantity <= 0)
        {
            throw new InvalidOperationException("Cannot add item to basket. ");
        }
        var basketItem = BasketItems.FirstOrDefault(b => b.InventoryId == inventory.InventoryId);
        if (basketItem != null)
        {
           
            inventory.Quantity--;
            basketItem.Quantity++;
            basketItem.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var newBasketItem = new BasketItem(ShoppingBasketId, inventory.InventoryId, inventory.Price);
            inventory.Quantity--;
            inventory.CurrentlyInBaskets++;
            BasketItems.Add(newBasketItem);
        }
        TotalPrice += inventory.Price;
        UpdatedAt = DateTime.UtcNow;
    }
    public void RemoveFromBasket(ArtStoreInventory inventory)
    {
        var basketItem = BasketItems.FirstOrDefault(b => b.InventoryId == inventory.InventoryId);
        if (basketItem != null)
        {
            if (basketItem.Quantity > 1)
            {
                basketItem.Quantity--;
                basketItem.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                BasketItems.Remove(basketItem);
                inventory.CurrentlyInBaskets--;
            }
            TotalPrice -= inventory.Price;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
