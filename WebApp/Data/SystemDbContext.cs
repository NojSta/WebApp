using Microsoft.EntityFrameworkCore;
using WebApp.Data.Entities;

namespace WebApp.Data;

public class SystemDbContext: DbContext
{
    private readonly IConfiguration _configuration;
    public DbSet<Destination> Destinations { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Comment> Comments { get; set; }

    public SystemDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(_configuration.GetConnectionString("PostgreSQL"));
    }
    
}