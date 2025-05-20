namespace ArtStoreAPI.Services;
using ArtStoreAPI.Models;
using ArtStoreAPI;
using Microsoft.EntityFrameworkCore;
using ArtStoreAPI.ModelsDTO;

public class AdminServices(StoreContext context)
{
    /// <summary>
    /// Helper method to create a new list of Tags given a list of strings, called from Endpoints
    /// </summary>
    /// <param name="tags"></param>
    /// <returns></returns>
    public List<Tag> CreateTags(List<string> tags)
    {
        List<Tag> tagList = new List<Tag>();
        foreach (var tag in tags)
        {
            if (context.Tags.Any(t => t.Name == tag))
            {
                var existingTag = context.Tags.FirstOrDefault(t => t.Name == tag);
                if (existingTag != null)
                {
                    tagList.Add(existingTag);
                    continue;
                }
            }
            Tag newTag = new Tag
            {
                Name = tag,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };
            context.Tags.Add(newTag);
            context.SaveChanges();
            tagList.Add(newTag);
        }
        return tagList;
    }


    /// <summary>
    /// Helper method to create a new Maker, called from Endpoints
    /// </summary>
    /// <param name="newMaker"></param>
    /// <returns></returns>
    public Maker CreateMaker(MakerDTO newMaker)
    {
        Maker possibleMaker = context.Makers.FirstOrDefault(m => m.Firstname == newMaker.Firstname && m.Lastname == newMaker.Lastname);
        if (possibleMaker != null)
        {
            return possibleMaker;
        }
        Maker maker = new Maker
        {
            Firstname = newMaker.Firstname,
            Lastname = newMaker.Lastname,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };
        context.Makers.Add(maker);
        context.SaveChanges();
        return maker;
    }

    public OrderDTO OrderToDTO(Order order)
    {
        return new OrderDTO
        {
            OrderId = order.OrderId,
            ShoppingBasket = context.ShoppingBaskets.Include(b => b.BasketItems).ThenInclude(inv => inv.Inventory).FirstOrDefault(b => b.ShoppingBasketId == order.ShoppingBasketId),
            ShopCustomer = context.ShopCustomers.FirstOrDefault(c => c.ShopCustomerId == order.ShopCustomerId).ToDTO(),
            TotalCost = order.TotalCost,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            ShippedAt = order.ShippedAt,
            ShippingCost = order.ShippingCost,
            Status = order.Status,
            PaymentDetail = order.PaymentDetail
        };
    }

    public bool CancelAndRefund(Order order)
    {
        var basket = context.ShoppingBaskets.Include(b => b.BasketItems).ThenInclude(i => i.Inventory).FirstOrDefault(b => b.ShoppingBasketId == order.ShoppingBasketId);
        if (basket != null)
        {
            if (basket.BasketItems != null && basket.BasketItems.Count > 0)
            {
                foreach (var item in basket.BasketItems)
                {
                    var inventory = context.ArtStoreInventories.FirstOrDefault(i => i.InventoryId == item.InventoryId);
                    if (inventory != null)
                    {
                        inventory.Quantity += item.Quantity;
                        inventory.UpdatedAt = DateTime.UtcNow;
                    }
                }
            }
            basket.Status = Status.Cancelled;
            order.Status = Status.Refunded;
            context.SaveChanges();
            return true;
        }
        return false;
    }
}
