using Microsoft.AspNetCore.Mvc;

using ArtStoreAPI.Models;
namespace ArtStoreAPI.Controllers;

public class ShoppingController : ControllerBase
{
    [HttpPost]
    [Route("shopping/createUserProfile")]
    public IActionResult CreateUserProfile()
    {
        return Ok();
    }
}
