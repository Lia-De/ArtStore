using System.ComponentModel.DataAnnotations;

namespace ArtStoreAPI.Models;

public class InventoryDTO
{
    public int? InventoryId { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public MakerDTO Maker { get; set; }
    public int CurrentlyInBaskets { get; set; } = 0;

}
