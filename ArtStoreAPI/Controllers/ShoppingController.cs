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
        var newCustomer = customer as ShopCustomer;
        newCustomer.CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        newCustomer.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        context.ShopCustomers.Add(newCustomer);
        context.SaveChanges();

        return Ok(newCustomer);
    }

    [HttpGet]
    [Route("shopping/getUserProfile/{userId}")]
    public IActionResult GetUserProfile(string userId)
    {
        var customer = context.ShopCustomers.FirstOrDefault(c => c.UserId == userId);
        if (customer == null)
        {
            return NotFound("Customer not found.");
        }
        return Ok(customer);
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
    [HttpPost]
    [Route("shopping/addToBasket")]
    public IActionResult AddToBasket([FromBody] BasketAddDTO addToBasket)
    {
        if (addToBasket == null)
        {
            return BadRequest("Invalid basket data.");
        }
        if (addToBasket.ShoppingBasketId == null || addToBasket.ShoppingBasketId <=0)
        {
            var newBasket = new ShoppingBasket
            {
                CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };
        
            context.ShoppingBaskets.Add(newBasket);

        }
        
        context.SaveChanges();
        
        return Ok();
    }

}
