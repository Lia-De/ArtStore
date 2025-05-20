namespace ArtStoreAPI.ModelsDTO;

/// <summary>
/// Data Transfer Object for Checkout: CustomerId, ShoppingBasketId, PaymentDetail, ShippingMethod
/// </summary>
public class CheckoutDTO
{
    public int CustomerId { get; set; }
    public int ShoppingBasketId { get; set; }
    public string PaymentDetail { get; set; } = string.Empty;
    public string ShippingMethod { get; set; } = string.Empty;
}
