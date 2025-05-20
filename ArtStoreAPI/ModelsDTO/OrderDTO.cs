using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ArtStoreAPI.Models;
using Microsoft.Identity.Client;

namespace ArtStoreAPI.ModelsDTO;

public class OrderDTO
{
    public int OrderId { get; set; }
    public ShoppingBasket ShoppingBasket { get; set; }
    public ShopCustomerDTO ShopCustomer { get; set; }
    public decimal TotalCost { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ShippedAt { get; set; }
    public decimal ShippingCost { get; set; }
    public Status Status { get; set; } = Status.Active;
    public string PaymentDetail { get; set; } = string.Empty; // Set dummy values from frontend
}
