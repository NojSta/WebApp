using Microsoft.EntityFrameworkCore;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using WebApp.Data;
using WebApp.Data.Entities;

namespace WebApp;

public static class Endpoints
{
    public static void AddDestinationApi(this WebApplication app)
    {
        var destinationsGroups = app.MapGroup("/api").AddFluentValidationAutoValidation();

        destinationsGroups.MapGet("/destinations", async (SystemDbContext dbContext) =>
        {
            return (await dbContext.Destinations.ToListAsync()).Select(destination => destination.ToDto() );
        });

        destinationsGroups.MapGet("/destinations/{destinationId}", (int destinationId, SystemDbContext dbContext) =>
        {
            var destination = dbContext.Destinations.Find(destinationId);
            return destination == null ? Results.NotFound() : TypedResults.Ok(destination.ToDto());
        });

        destinationsGroups.MapPost("/destinations", async (CreateDestinationDto dto, SystemDbContext dbContext) =>
        {
            var destination = new Destination { Name = dto.Name, Content = dto.Content };
            dbContext.Destinations.Add(destination);
    
            await dbContext.SaveChangesAsync();

            return TypedResults.Created($"api/destinations/{destination.Id}", destination.ToDto());
        });

        destinationsGroups.MapPut("/destinations/{destinationID}", async (UpdateDestinationDto dto, int destinationId, SystemDbContext dbContext) =>
        {
            var destination = await dbContext.Destinations.FindAsync(destinationId);
            if (destination == null)
            {
                return Results.NotFound();
            }
            destination.Content = dto.Content;
            dbContext.Destinations.Update(destination);
            await dbContext.SaveChangesAsync();
            return TypedResults.Ok(destination.ToDto());
    
        });

        destinationsGroups.MapDelete("/destinations/{destinationId}", async (int destinationId, SystemDbContext dbContext) =>
        {
            var destination = await dbContext.Destinations.FindAsync(destinationId);
            if (destination == null)
            {
                return Results.NotFound();
            }
            dbContext.Destinations.Remove(destination);
            await dbContext.SaveChangesAsync();
            return TypedResults.NoContent();
        });
    }
}