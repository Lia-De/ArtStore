using ArtStoreAPI.Models;
using ArtStoreAPI.ModelsDTO;
using ArtStoreAPI;
using Microsoft.EntityFrameworkCore;
namespace ArtStoreAPI.Services;

public class ShoppingService(StoreContext context)
{
    public decimal CheckoutBasket(ShoppingBasket basket, int customerId, decimal shippingCost)
    {
        if (basket == null || basket.BasketItems == null || basket.BasketItems.Count == 0)
        {
            throw new InvalidOperationException("Cannot checkout an empty basket.");
        }

        Order order = new(basket, shippingCost) 
            {
                ShopCustomerId = customerId, 
                ShoppingBasketId = basket.ShoppingBasketId
            };

        context.Orders.Add(order);
        
        basket.Status = Status.Purchased;
        basket.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        
        // Update the inventory, removing the items from available stock
        foreach (var item in basket.BasketItems)
        {
            var inventory = context.ArtStoreInventories.FirstOrDefault(i => i.InventoryId == item.InventoryId);
            if (inventory == null)
            {
                throw new InvalidOperationException($"No such item in store.");
            }

            inventory.CurrentlyInBaskets -= item.Quantity;
            inventory.UpdatedAt = DateTime.UtcNow;
        }
        context.SaveChanges();
        return order.TotalCost;
    }

    public void CancelBasket(ShoppingBasket basket)
    {
        if (basket.BasketItems != null && basket.BasketItems.Count > 0)
        {
            foreach (var item in basket.BasketItems)
            {
                var inventory = context.ArtStoreInventories.FirstOrDefault(i => i.InventoryId == item.InventoryId);
                if (inventory != null)
                {
                    inventory.CurrentlyInBaskets -= item.Quantity;
                    inventory.Quantity += item.Quantity;
                    inventory.UpdatedAt = DateTime.UtcNow;
                }
                context.BasketItems.Remove(item);
            }

        }
        
        context.ShoppingBaskets.Remove(basket);
        context.SaveChanges();
    }
}
