using ArtStoreAPI.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ArtStoreAPI.ModelsDTO;

public class ShopCustomerDTO
{
    public int ShopCustomerId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public long CreatedAt { get; set; }
    public long UpdatedAt { get; set; }
    public List<ShoppingBasket> ShoppingBaskets { get; set; } = [];
    public List<Order> Orders { get; set; } = [];
    public string PaymentDetail { get; set; } = string.Empty; // Set dummy values from frontend
}
