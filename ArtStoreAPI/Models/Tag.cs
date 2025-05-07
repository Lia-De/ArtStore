using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace ArtStoreAPI.Models;

public class Tag
{
    [Key] public int TagId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    //[JsonIgnore]
    public List<ArtStoreInventory> ArtStoreInventories { get; set; } = [];

   
}