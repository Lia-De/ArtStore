using Microsoft.AspNetCore.Identity;

namespace ArtStoreAPI.Models
{
    public class AppUser : IdentityUser
    {
        public ShopCustomer CustomerProfile { get; set; } = new ShopCustomer();
    }
}
