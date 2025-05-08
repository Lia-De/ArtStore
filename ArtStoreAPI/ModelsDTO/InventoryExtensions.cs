using ArtStoreAPI.Models;
using ArtStoreAPI.Services;
namespace ArtStoreAPI.ModelsDTO;

public static class InventoryExtensions
{
   public static InventoryDTO ToDTO(this ArtStoreInventory inventory)
{
    return new InventoryDTO
        {
            InventoryId = inventory.InventoryId,
            Name = inventory.Name,
            Description = inventory.Description,
            Price = inventory.Price,
            Quantity = inventory.Quantity,
            ImageUrl = inventory.ImageUrl,
            CreatedAt = new DateTimeOffset(inventory.CreatedAt).ToUnixTimeSeconds(),
            UpdatedAt = new DateTimeOffset(inventory.UpdatedAt).ToUnixTimeSeconds(),
            Tags = inventory.Tags.Select(t => t.Name).ToList(),
            Maker = new MakerDTO
            {
                MakerId = inventory.Maker.MakerId,
                Firstname = inventory.Maker.Firstname,
                Lastname = inventory.Maker.Lastname,
                CreatedAt = new DateTimeOffset(inventory.UpdatedAt).ToUnixTimeSeconds()
            },
            CurrentlyInBaskets = inventory.CurrentlyInBaskets
        };
    }

    public static ArtStoreInventory FromDTO(this InventoryDTO dto, Maker maker, List<Tag> tags)
    {
        return new ArtStoreInventory
        {
            InventoryId = dto.InventoryId ?? 0,
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Quantity = dto.Quantity,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTimeOffset.FromUnixTimeSeconds(dto.CreatedAt).UtcDateTime,
            UpdatedAt = DateTimeOffset.FromUnixTimeSeconds(dto.UpdatedAt).UtcDateTime,
            Tags = tags,
            Maker = maker,
            CurrentlyInBaskets = dto.CurrentlyInBaskets
        };
    }

    public static MakerListDTO MakerListToDTO(this Maker maker)
    {
        return new MakerListDTO
        {
            MakerId = maker.MakerId,
            Name = maker.MakerName()
        };
    }

}
