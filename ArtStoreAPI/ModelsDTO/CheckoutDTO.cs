namespace ArtStoreAPI.ModelsDTO;

public class CheckoutDTO
{
    public int CustomerId { get; set; }
    public int ShoppingBasketId { get; set; }
    public string PaymentDetail { get; set; } = string.Empty;
    public string ShippingMethod { get; set; } = string.Empty;
}
