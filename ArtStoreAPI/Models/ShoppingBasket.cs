using ArtStoreAPI.ModelsDTO;
using System.ComponentModel.DataAnnotations;
namespace ArtStoreAPI.Models;

public class ShoppingBasket
{
    [Key] public int ShoppingBasketId { get; set; }
    public int CustomerId{ get; set; } = 0;
    public List<BasketItem> BasketItems { get; set; } = [];
    public long CreatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    public long UpdatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    public decimal TotalPrice { get; set; }
    public Status Status { get; set; } = Status.Active;

    public void AddToBasket(ArtStoreInventory inventory, int itemsToAdd)
    {
        if (!inventory.AvailableToPurchase(itemsToAdd))
        {
            throw new InvalidOperationException("Cannot add item to basket. Not enough stock available.");
        }

        if (inventory.Quantity <= 0)
        {
            throw new InvalidOperationException("Cannot add item to basket. ");
        }
        var basketItem = BasketItems.FirstOrDefault(b => b.InventoryId == inventory.InventoryId);
        
        // The item is already in the basked, update the quantity
        if (basketItem != null)
        {
            basketItem.Quantity += itemsToAdd;
            inventory.Quantity -= itemsToAdd;
            inventory.CurrentlyInBaskets += itemsToAdd;
            inventory.UpdatedAt = DateTime.UtcNow;
            basketItem.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        }
        // Item is not already in the basket, create a new item and update.
        else
        {

            var newBasketItem = new BasketItem(ShoppingBasketId, inventory.InventoryId, inventory.Price);
            inventory.Quantity--;
            inventory.CurrentlyInBaskets++;
            BasketItems.Add(newBasketItem);
        }
        TotalPrice += (inventory.Price * itemsToAdd);
        UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
    }

    public void RemoveFromBasket(ArtStoreInventory inventory)
    {
        var basketItem = BasketItems.FirstOrDefault(b => b.InventoryId == inventory.InventoryId);
        if (basketItem != null)
        {
            if (basketItem.Quantity > 1)
            {
                basketItem.Quantity--;
                basketItem.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            }
            else
            {
                BasketItems.Remove(basketItem);
            }
            inventory.CurrentlyInBaskets--;
            TotalPrice -= inventory.Price;
            UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        }
    }
}
