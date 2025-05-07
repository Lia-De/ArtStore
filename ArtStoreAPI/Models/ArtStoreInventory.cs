using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ArtStoreAPI.Models;

public class ArtStoreInventory
{
    [Key] public int InventoryId { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<Tag> Tags { get; set; } = [];
    public Maker Maker { get; set; }
    public int CurrentlyInBaskets { get; set; } = 0;


}
