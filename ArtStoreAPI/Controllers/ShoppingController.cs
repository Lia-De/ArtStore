using Microsoft.AspNetCore.Mvc;
using ArtStoreAPI.Models;
using ArtStoreAPI.ModelsDTO;
using ArtStoreAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace ArtStoreAPI.Controllers;

public class ShoppingController(StoreContext context, UserManager<AppUser> userManager, ShoppingService shoppingService) : ControllerBase
{
    [HttpPost]
    [Route("shopping/createUserProfile")]
    public IActionResult CreateUserProfile([FromBody] ShopCustomer customer)
    {
        if (customer == null)
        {
            return BadRequest("Invalid customer data.");
        }
        if (string.IsNullOrEmpty(customer.Firstname) || string.IsNullOrEmpty(customer.Lastname))
        {
            return BadRequest("Firstname and Lastname are required.");
        }
        if (string.IsNullOrEmpty(customer.Email))
        {
            return BadRequest("Email is required.");
        }
        if (string.IsNullOrEmpty(customer.Password))
        {
            return BadRequest("Password is required.");
        }
        var newCustomer = customer as ShopCustomer;
        newCustomer.CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        newCustomer.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        context.ShopCustomers.Add(newCustomer);
        context.SaveChanges();

        return Ok(newCustomer);
    }

    [HttpGet]
    [Route("shopping/getUserProfile/{userId}")]
    public IActionResult GetUserProfile(int userId)
    {
        var customer = context.ShopCustomers.FirstOrDefault(c => c.ShopCustomerId == userId);
        if (customer == null)
        {
            return NotFound("Customer not found.");
        }
        return Ok(customer.ToDTO());
    }
    [HttpGet]
    [Route("shopping/listInventories")]
    public IActionResult ListInventories()
    {
        var inventories = context.ArtStoreInventories
            .Include(t => t.Tags)
            .Include(m => m.Maker)
            .AsNoTracking()
            .ToList()
            .Select(inventory => inventory.ToDTO())
            .ToList();
        return Ok(inventories);
    }
    [HttpGet]
    [Route("shopping/getInventory/{id}")]
    public IActionResult GetInventory(int id)
    {
        var inventory = context.ArtStoreInventories
            .Include(t => t.Tags)
            .Include(m => m.Maker)
            .FirstOrDefault(i => i.InventoryId == id);
        if (inventory == null)
        {
            return NotFound("Inventory not found.");
        }
        return Ok(inventory.ToDTO());
    }
    [HttpGet]
    [Route("shopping/getBasket/{basketId}")]
    public IActionResult GetBasket(int basketId)
    {
        var shoppingBasket = context.ShoppingBaskets
            .Include(b => b.BasketItems)
            .ThenInclude(bi => bi.Inventory)
            .FirstOrDefault(b => b.ShoppingBasketId == basketId);
        if (shoppingBasket == null)
        {
            return NotFound("Shopping basket not found.");
        }
        return Ok(shoppingBasket);
    }

    [HttpPost]
    [Route("shopping/addToBasket")]
    public IActionResult AddToBasket([FromBody] BasketAddDTO addInventoryToBasket)
    {
        ShoppingBasket? shoppingBasket;
        if (addInventoryToBasket == null)
        {
            return BadRequest("Invalid basket data.");
        }
        if (addInventoryToBasket.InventoryId == 0)
        {
            return BadRequest("Inventory ID is required.");
        }
        ArtStoreInventory? inventory = context.ArtStoreInventories.FirstOrDefault(i => i.InventoryId == addInventoryToBasket.InventoryId);
        if (inventory == null)
        {
            return NotFound("Inventory not found.");
        }
        
        if (addInventoryToBasket.ShoppingBasketId == 0)
        {
            shoppingBasket = new ShoppingBasket() { CustomerId = addInventoryToBasket.CustomerId };

            context.ShoppingBaskets.Add(shoppingBasket);
        } else
        {
            shoppingBasket = context.ShoppingBaskets.Include(b=> b.BasketItems).ThenInclude(i=> i.Inventory).FirstOrDefault(b => b.ShoppingBasketId == addInventoryToBasket.ShoppingBasketId);
            if ( shoppingBasket == null)
            {
                return BadRequest("Invalid basket ID.");
            }
            
        }

        shoppingBasket.AddToBasket(inventory, addInventoryToBasket.Quantity);

        context.SaveChanges();
        
        return Ok(shoppingBasket);
    }
    [HttpPost]
    [Route("shopping/cancelBasket/{shoppingBasketId}")]
    public IActionResult CancelBasket(int shoppingBasketId)
    {
        var shoppingBasket = context.ShoppingBaskets
            .Include(b => b.BasketItems)
            .ThenInclude(bi => bi.Inventory)
            .FirstOrDefault(b => b.ShoppingBasketId == shoppingBasketId);
        if (shoppingBasket != null)
            shoppingService.CancelBasket(shoppingBasket);
        
        return Ok();
    }
    [HttpPost]
    [Route("shopping/checkout/")]
    public IActionResult Checkout([FromBody] CheckoutDTO checkout )
    {
        if (checkout == null)
        {
            return BadRequest("Invalid checkout data.");
        }
        if (checkout.ShoppingBasketId == 0)
        {
            return BadRequest("Shopping basket ID is required.");
        }
        if (checkout.CustomerId == 0)
        {
            return BadRequest("Customer ID is required.");
        }

        var shoppingBasket = context.ShoppingBaskets
            .Include(b => b.BasketItems)
            .ThenInclude(bi => bi.Inventory)
            .FirstOrDefault(b => b.ShoppingBasketId == checkout.ShoppingBasketId);

        if (shoppingBasket == null)
        {
            return NotFound("Shopping basket not found.");
        }
        if (shoppingBasket.Status == Status.Purchased)
        {
            return BadRequest("Shopping basket has already been purchased.");
        }
        var customer = context.ShopCustomers.FirstOrDefault(c => c.ShopCustomerId == checkout.CustomerId);
        decimal shippingCost = checkout.ShippingMethod == "express" ? 150 : 50;
        var totalCost = shoppingService.CheckoutBasket(shoppingBasket, checkout.CustomerId, shippingCost);

        return Ok(totalCost);
    }

}
