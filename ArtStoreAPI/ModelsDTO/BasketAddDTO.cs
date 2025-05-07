namespace ArtStoreAPI.ModelsDTO;

public class BasketAddDTO
{
    public int CustomerId { get; set; }
    public int ShoppingBasketId { get; set; }
    public int InventoryId { get; set; }
    public int Quantity { get; set; }
}
