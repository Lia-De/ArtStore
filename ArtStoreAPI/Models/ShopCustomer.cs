using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ArtStoreAPI.Models;

public class ShopCustomer
{
    [Key] public int ShopCustomerId { get; set; }
    [ForeignKey("Id")] public string UserId { get; set; } = string.Empty;
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ShoppingBasket> ShoppingBaskets { get; set; } = [];
    public List<Order> Orders { get; set; } = [];
    public string PaymentDetail { get; set; } = string.Empty; // Set dummy values from frontend


}
