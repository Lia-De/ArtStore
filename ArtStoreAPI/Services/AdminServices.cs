namespace ArtStoreAPI.Services;
using ArtStoreAPI.Models;
using ArtStoreAPI;
using Microsoft.EntityFrameworkCore;
using ArtStoreAPI.ModelsDTO;

public class AdminServices
{
    private readonly StoreContext _context;
    public AdminServices(StoreContext context)
    {
        _context = context;
    }
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


    /// <summary>
    /// Helper method to create a new Maker, called from Endpoints
    /// </summary>
    /// <param name="newMaker"></param>
    /// <returns></returns>
    public Maker CreateMaker(MakerDTO newMaker)
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


    //public InventoryDTO InventoryToDTO(this ArtStoreInventory inventory)
    //{
    //    return new InventoryDTO
    //    {
    //        InventoryId = inventory.InventoryId,
    //        Name = inventory.Name,
    //        Description = inventory.Description,
    //        Price = inventory.Price,
    //        Quantity = inventory.Quantity,
    //        ImageUrl = inventory.ImageUrl,
    //        CreatedAt = new DateTimeOffset(inventory.CreatedAt).ToUnixTimeSeconds(),
    //        UpdatedAt = new DateTimeOffset(inventory.UpdatedAt).ToUnixTimeSeconds(),
    //        Tags = inventory.Tags.Select(t => t.Name).ToList(),
    //        Maker = new MakerDTO
    //        {
    //            MakerId = inventory.Maker.MakerId,
    //            Firstname = inventory.Maker.Firstname,
    //            Lastname = inventory.Maker.Lastname,
    //            CreatedAt = new DateTimeOffset(inventory.UpdatedAt).ToUnixTimeSeconds()
    //        },
    //        CurrentlyInBaskets = inventory.CurrentlyInBaskets
    //    };
    //}

    //public ArtStoreInventory InventoryFromDTO(InventoryDTO dto)
    //{
    //    return new ArtStoreInventory
    //    {
    //        InventoryId = dto.InventoryId ?? 0,
    //        Name = dto.Name,
    //        Description = dto.Description,
    //        Price = dto.Price,
    //        Quantity = dto.Quantity,
    //        ImageUrl = dto.ImageUrl,
    //        CreatedAt = DateTimeOffset.FromUnixTimeSeconds(dto.CreatedAt).UtcDateTime,
    //        UpdatedAt = DateTimeOffset.FromUnixTimeSeconds(dto.UpdatedAt).UtcDateTime,
    //        Tags = CreateTags(dto.Tags),
    //        Maker = new Maker
    //        {
    //            MakerId = dto.Maker.MakerId ?? 0,
    //            Firstname = dto.Maker.Firstname,
    //            Lastname = dto.Maker.Lastname,
    //            CreatedAt = DateTimeOffset.FromUnixTimeSeconds(dto.Maker.CreatedAt ?? 0).UtcDateTime
    //        },
    //        CurrentlyInBaskets = dto.CurrentlyInBaskets
    //    };
    //}

}
