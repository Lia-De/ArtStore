using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using ArtStoreAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
namespace ArtStoreAPI.Controllers;

public class AdminController : ControllerBase
{

    private StoreContext _context;

    private readonly UserManager<AppUser> _userManager;
    public AdminController(StoreContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    [Route("admin/inventory")]
    public List<ArtStoreInventory>? AllInventories()
    {
        return _context.ArtStoreInventories.Include(t => t.Tags).Include(m=>m.Maker).ToList();
    }
    [HttpGet]
    [Route("admin/inventory/{id}")]
    public ArtStoreInventory? GetInventory(int id)
    {
        return _context.ArtStoreInventories.Include(t => t.Tags).Include(m=>m.Maker).FirstOrDefault(i => i.InventoryId == id);
    }
    [HttpGet]
    [Route("admin/makers")]
    public List<Maker>? AllMakers()
    {
        return _context.Makers.Include(mk => mk.ArtStoreInventories).ToList();
    }
    [HttpGet]
    [Route("admin/maker/{id}")]
    public Maker? GetMaker(int id)
    {
        return _context.Makers.Include(mk => mk.ArtStoreInventories).FirstOrDefault(m => m.MakerId == id);
    }
    [HttpGet]
    [Route("admin/tags")]
    public List<Tag>? AllTags()
    {
        return _context.Tags.ToList();
    }
    [HttpGet]
    [Route("admin/tag/{id}")]
    public Tag? GetTag( int id)
    {
        return _context.Tags.Include(t => t.ArtStoreInventories).FirstOrDefault(t => t.TagId == id);
    }



    /// <summary>
    /// Helper method to create a new Maker, called from Endpoints
    /// </summary>
    /// <param name="newMaker"></param>
    /// <returns></returns>
    private Maker CreateMaker(MakerDTO newMaker)
    {
        Maker possibleMaker = _context.Makers.FirstOrDefault(m => m.Firstname == newMaker.Firstname && m.Lastname == newMaker.Lastname);
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
        _context.Makers.Add(maker);
        _context.SaveChanges();
        return maker;
    }
    /// <summary>
    /// Helper method to create a new list of Tags given a list of strings, called from Endpoints
    /// </summary>
    /// <param name="tags"></param>
    /// <returns></returns>
    private List<Tag> CreateTags(List<string> tags)
    {
        List<Tag> tagList = new List<Tag>();
        foreach (var tag in tags)
        {
            if (_context.Tags.Any(t => t.Name == tag))
            {
                var existingTag = _context.Tags.FirstOrDefault(t => t.Name == tag);
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
            _context.Tags.Add(newTag);
            _context.SaveChanges();
            tagList.Add(newTag);
        }
        return tagList;
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
        var possibleMaker = _context.Makers.FirstOrDefault(artist => artist.Firstname == newMaker.Firstname && artist.Lastname == newMaker.Lastname);
        if (possibleMaker != null)
        {
            return Ok(possibleMaker);
        }

        Maker maker = CreateMaker(newMaker);

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
        var maker = _context.Makers.FirstOrDefault(artist => artist.MakerId == newInventory.Maker.MakerId);
        if (maker == null)
        {
            maker = CreateMaker(newInventory.Maker);
        }
        // Format the taglist to proper tags
        var tagList = CreateTags(newInventory.Tags);


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

        _context.ArtStoreInventories.Add(inventory);
        _context.SaveChanges();
        return Ok(inventory);
    }

    [HttpPost]
    [Route("admin/inventoryRemoveTag")]
    public IActionResult InventoryRemoveTag(int inventoryId, int tagId)
    {
        var inventory = _context.ArtStoreInventories.Include(t => t.Tags).FirstOrDefault(i => i.InventoryId == inventoryId);
        if (inventory == null)
        {
            return NotFound("Inventory not found.");
        }
        var tag = _context.Tags.FirstOrDefault(t => t.TagId == tagId);
        if (tag == null)
        {
            return NotFound("Tag not found.");
        }
        inventory.Tags.Remove(tag);
        _context.SaveChanges();
        return Ok(inventory);
    }
}
