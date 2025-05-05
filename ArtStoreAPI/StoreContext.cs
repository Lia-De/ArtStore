using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using ArtStoreAPI.Models;
namespace ArtStoreAPI;

public class StoreContext: IdentityDbContext<AppUser>
{

    public StoreContext(DbContextOptions<StoreContext> options) : base(options)
    {

    }
    
    public DbSet<ArtStoreInventory> ArtStoreInventories { get; set; }
    public DbSet<BasketItem> BasketItems { get; set; }
    public DbSet<Maker> Makers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<ShopCustomer> ShopCustomers { get; set; }
    public DbSet<ShoppingBasket> ShoppingBaskets { get; set; }
    public DbSet<Tag> Tags { get; set; }


}
