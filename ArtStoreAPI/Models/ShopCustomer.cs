using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ArtStoreAPI.ModelsDTO;
namespace ArtStoreAPI.Models;

public class ShopCustomer
{
    [Key] public int ShopCustomerId { get; set; }
    [ForeignKey("Id")] public string UserId { get; set; } = string.Empty;
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
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

    // add a DTO Conversion
    public ShopCustomerDTO? ToDTO()
    {
        if (this == null)
        {
            return null;
        }
        return new ShopCustomerDTO
        {
            ShopCustomerId = this.ShopCustomerId,
            Firstname = this.Firstname,
            Lastname = this.Lastname,
            Email = this.Email,
            Phone = this.Phone,
            Address = this.Address,
            City = this.City,
            ZipCode = this.ZipCode,
            Country = this.Country,
            CreatedAt = this.CreatedAt,
            UpdatedAt = this.UpdatedAt,
            ShoppingBaskets = this.ShoppingBaskets,
            Orders = this.Orders,
            PaymentDetail = this.PaymentDetail
        };
    }
}
