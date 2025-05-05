using Microsoft.EntityFrameworkCore;
using ArtStoreAPI;
using ArtStoreAPI.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
DotNetEnv.Env.Load();
string dbVariable = Environment.GetEnvironmentVariable("SQLite_SRC");
builder.Services.AddDbContext<StoreContext>(opt => opt.UseSqlite(dbVariable, sqliteOptions => {
    sqliteOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
}));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Enadle us to load database nested opjects, without going into infinite loops.
builder.Services.AddControllers().AddJsonOptions(options => options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<StoreContext>();

var app = builder.Build();

app.MapIdentityApi<AppUser>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
