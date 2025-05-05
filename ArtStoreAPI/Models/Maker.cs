using System.ComponentModel.DataAnnotations;
namespace ArtStoreAPI.Models;

public class Maker
{
    [Key] public int MakerId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ArtStoreInventory> ArtStoreInventories { get; set; } = new List<ArtStoreInventory>();

    public string MakerName()
    {
        return $"{Firstname} {Lastname}";
    }
}