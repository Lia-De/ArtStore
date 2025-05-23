using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using ArtStoreAPI.Models;
using ArtStoreAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using ArtStoreAPI.ModelsDTO;
namespace ArtStoreAPI.Controllers;

public class AdminController(StoreContext context, UserManager<AppUser> userManager, AdminServices adminServices) : ControllerBase
{
    [HttpGet]
    [Route("admin/inventory")]
    public List<InventoryDTO>? AllInventories()
    {
        return context.ArtStoreInventories
        .Include(t => t.Tags)
        .Include(m => m.Maker)
        .AsNoTracking()
        .Where(i => i.IsDeleted == false && i.Quantity > 0)
        .ToList()
        .Select(inventory => inventory.ToDTO())
        .ToList();

    }
    [HttpGet]
    [Route("admin/inventory/{id}")]
    public ArtStoreInventory? GetInventory(int id)
    {
        return context.ArtStoreInventories.Include(t => t.Tags).Include(m=>m.Maker).FirstOrDefault(i => i.InventoryId == id);
    }
    [HttpGet]
    [Route("admin/makers")]
    public List<Maker>? AllMakers()
    {
        return context.Makers.Include(mk => mk.ArtStoreInventories).ToList();
    }
    [HttpGet]
    [Route("admin/maker/{id}")]
    public Maker? GetMaker(int id)
    {
        return context.Makers.Include(mk => mk.ArtStoreInventories).FirstOrDefault(m => m.MakerId == id);
    }

    [HttpGet]
    [Route("admin/makerlistDTO")]
    public List<MakerListDTO>? AllMakersDTO()
    {
        return context.Makers.Select(m => m.MakerListToDTO()).ToList();
    }

    [HttpGet]
    [Route("admin/tags")]
    public List<Tag>? AllTags()
    {
        return context.Tags.ToList();
    }
    [HttpGet]
    [Route("admin/tag/{id}")]
    public Tag? GetTag( int id)
    {
        return context.Tags.Include(t => t.ArtStoreInventories).FirstOrDefault(t => t.TagId == id);
    }

    [HttpGet]
    [Route("admin/allActiveBaskets")]
    public List<ShoppingBasket>? AllActiveBaskets()
    {
        return context.ShoppingBaskets
            .Include(bi=> bi.BasketItems)
            .Where(b => b.Status == Status.Active)
            .ToList();
    }


    [HttpPost]
    [Route("admin/addMaker")]
    public IActionResult AddMaker (MakerDTO newMaker)
    {
        if (newMaker == null)
        {
            return BadRequest("Invalid inventory data.");
        }
        if (newMaker.Firstname == null || newMaker.Lastname == null)
        {
            return BadRequest("Firstname and Lastname are required.");
        }
        // Check if the maker already exists, if so return that entry.
        var possibleMaker = context.Makers.FirstOrDefault(artist => artist.Firstname == newMaker.Firstname && artist.Lastname == newMaker.Lastname);
        if (possibleMaker != null)
        {
            return Ok(possibleMaker);
        }

        Maker maker = adminServices.CreateMaker(newMaker);

        return Ok(maker);
    }
    [HttpPost]
    [Route("admin/addInventory")]
    public IActionResult AddInventory([FromBody]InventoryDTO newInventory)
    {
            Console.WriteLine(newInventory.Name);
        if (newInventory == null)
        {
            return BadRequest("Invalid inventory data.");
        }
        if (newInventory.Name.IsNullOrEmpty())
        {
            return BadRequest("Name required.");
        }
        if ( newInventory.Price <= 0 )
        {
            return BadRequest("Price must be greater than 0.");
        }
        // Check if the maker already exists, if so return that entry.
        var maker = context.Makers.FirstOrDefault(artist => artist.MakerId == newInventory.Maker.MakerId);
        if (maker == null)
        {
            maker = adminServices.CreateMaker(newInventory.Maker);
        }
        // Format the taglist to proper tags
        var tagList = adminServices.CreateTags(newInventory.Tags);


        ArtStoreInventory inventory = new ArtStoreInventory
        {
            Name = newInventory.Name,
            Description = newInventory.Description,
            Price = newInventory.Price,
            Quantity = newInventory.Quantity,
            ImageUrl = newInventory.ImageUrl,
            Tags = tagList,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            Maker = maker
        };

        context.ArtStoreInventories.Add(inventory);
        context.SaveChanges();
        return Ok(inventory.ToDTO());
    }

    [HttpPost]
    [Route("admin/uploadImage")]
    public async Task<IActionResult> UploadImage(IFormFile imageUpload)
    {
        var date = DateTime.Now.ToString("yyyyMMdd_HHmmss");
        var fileName = $"{date}_{imageUpload.FileName}";
        var filePath = Path.Combine("wwwroot", "images", fileName);
        
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imageUpload.CopyToAsync(stream);
        }

        //if (imageUpload == null || imageUpload.FileName == null)
        //{
        //return BadRequest("Invalid image data.");
        //}
        return Ok(fileName);
    }

    [HttpPost]
    [Route("admin/inventory/update/{id}")]
    public IActionResult UpdateInventory(int id, [FromBody] InventoryDTO inventory)
    {
        var existingInventory = context.ArtStoreInventories.Include(t => t.Tags).Include(m => m.Maker).FirstOrDefault(i => i.InventoryId == id);
        if (existingInventory == null)
        {
            return NotFound("Inventory not found.");
        }

        
        if (inventory == null)
        {
            return BadRequest("Invalid inventory data.");
        }
        if (inventory.Name.IsNullOrEmpty())
        {
            return BadRequest("Name required.");
        }
        if (inventory.Price <= 0)
        {
            return BadRequest("Price must be greater than 0.");
        }


        var tagList = adminServices.CreateTags(inventory.Tags);
        if (existingInventory.CurrentlyInBaskets <= inventory.Quantity) { 
            existingInventory.Quantity = inventory.Quantity;
        }

        existingInventory.Name = inventory.Name;
        existingInventory.Description = inventory.Description;
        existingInventory.Price = inventory.Price;
        existingInventory.ImageUrl = inventory.ImageUrl;
        existingInventory.Tags = tagList;
        existingInventory.UpdatedAt = DateTime.Now;

        context.SaveChanges();
        return Ok(existingInventory.ToDTO());
    }

    [HttpPost]
    [Route("admin/inventoryRemoveTag")]
    public IActionResult InventoryRemoveTag(int inventoryId, int tagId)
    {
        var inventory = context.ArtStoreInventories.Include(t => t.Tags).FirstOrDefault(i => i.InventoryId == inventoryId);
        if (inventory == null)
        {
            return NotFound("Inventory not found.");
        }
        var tag = context.Tags.FirstOrDefault(t => t.TagId == tagId);
        if (tag == null)
        {
            return NotFound("Tag not found.");
        }
        inventory.Tags.Remove(tag);
        context.SaveChanges();
        return Ok(inventory);
    }
    [HttpDelete]
    [Route("admin/inventory/delete/{id}")]
    public IActionResult DeleteInventory(int id)
    {
        var inventory = context.ArtStoreInventories.Include(t => t.Tags).Include(m => m.Maker).FirstOrDefault(i => i.InventoryId == id);
        if (inventory == null)
        {
            return NotFound("Inventory not found.");
        }
        if (inventory.CurrentlyInBaskets > 0)
        {
            return BadRequest("Inventory cannot be deleted while it is in a basket.");
        }
        inventory.Delete();
        context.SaveChanges();
        return Ok();
    }

    [HttpGet]
    [Route("admin/orders/all")]
    public List<OrderDTO>? AllOrders()
    {
        return context.Orders.Select(or => adminServices.OrderToDTO(or)).ToList();
    }
    [HttpGet]
    [Route("admin/orders/active")]
    public List<OrderDTO>? AllActiveOrders()
    {
        return context.Orders.Where(o => o.Status == Status.Active).Select(or => adminServices.OrderToDTO(or)).ToList();
    }
    [HttpGet]
    [Route("admin/orders/refunded")]
    public List<OrderDTO>? AllRefundedOrders()
    {
        return context.Orders.Where(o => o.Status == Status.Refunded).Select(or => adminServices.OrderToDTO(or)).ToList();
    }
    [HttpGet]
    [Route("admin/orders/shipped")]
    public List<OrderDTO>? AllShippedOrders()
    {
        return context.Orders.Where(o => o.Status == Status.Shipped).Select(or => adminServices.OrderToDTO(or)).ToList();
    }
    [HttpGet]
    [Route("admin/order/{id}")]
    public OrderDTO? GetOrder(int id)
    {
        return adminServices.OrderToDTO(context.Orders.FirstOrDefault(o => o.OrderId == id));
    }
    [HttpPost]
    [Route("admin/order/ship/{id}")]
    public IActionResult ShipOrder(int id)
    {
        var order = context.Orders.FirstOrDefault(o => o.OrderId == id);
        if (order == null)
        {
            return NotFound("Order not found.");
        }
        order.ShippedAt = DateTime.Now;
        order.Status = Status.Shipped;
        context.SaveChanges();
        return Ok();
    }
    [HttpPost]
    [Route("admin/order/refund/{id}")]
    public IActionResult RefundlOrder(int id)
    {
        var order = context.Orders.FirstOrDefault(o => o.OrderId == id);
        if (order == null)
        {
            return NotFound("Order not found.");
        }

        var result = adminServices.CancelAndRefund(order);
        
        return Ok(result);
    }

}
