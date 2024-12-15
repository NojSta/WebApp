﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using WebApp.Auth.Model;
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
        })
        .WithName("GetDestinations")
        .Produces<IEnumerable<DestinationDto>>(StatusCodes.Status200OK)
        .WithTags("Destinations");
        
        destinationsGroups.MapGet("/destinations/{destinationId}", (int destinationId, SystemDbContext dbContext) =>
        {
            var destination = dbContext.Destinations.Find(destinationId);
            return destination == null ? Results.NotFound() : TypedResults.Ok(destination.ToDto());
        })
        .WithName("GetDestinationById")
        .Produces<DestinationDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Destinations");

        destinationsGroups.MapPost("/destinations", [Authorize(Roles = ForumRoles.ForumUser)] async (CreateDestinationDto dto, HttpContext httpContext, SystemDbContext dbContext) =>
        {
            var destination = new Destination { Name = dto.Name, Content = dto.Content, UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)};
            dbContext.Destinations.Add(destination);
    
            await dbContext.SaveChangesAsync();

            return TypedResults.Created($"api/destinations/{destination.Id}", destination.ToDto());
        })
        .WithName("CreateDestinations")
        .Produces<DestinationDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status422UnprocessableEntity)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Destinations");

        destinationsGroups.MapPut("/destinations/{destinationID}", [Authorize] async (UpdateDestinationDto dto, int destinationId, HttpContext httpContext, SystemDbContext dbContext) =>
        {
            var destination = await dbContext.Destinations.FindAsync(destinationId);
            
            if (destination == null)
            {
                return Results.NotFound();
            }

            if (!httpContext.User.IsInRole(ForumRoles.Admin) &&
                httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != destination.UserId)
            {
                return Results.Forbid();
            }
            
            destination.Content = dto.Content;
            dbContext.Destinations.Update(destination);
            await dbContext.SaveChangesAsync();
            return TypedResults.Ok(destination.ToDto());
        })
        .WithName("UpdateDestination")
        .Produces<DestinationDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status422UnprocessableEntity)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Destinations");

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
        })
        .WithName("DeleteDestination")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Destinations");
    }
    
    public static void AddReviewApi(this WebApplication app)
    {
        var reviewsGroups = app.MapGroup("/api/destinations/{destinationId}").AddFluentValidationAutoValidation();

        reviewsGroups.MapGet("/reviews", async (int destinationId, SystemDbContext dbContext) =>
        {
            return await dbContext.Reviews
                .Where(review => review.Destination.Id == destinationId)
                .ToListAsync()
                .ContinueWith(task => task.Result.Select(review => review.ToDto()));
        })
        .WithName("GetReviews")
        .Produces<IEnumerable<ReviewDto>>(StatusCodes.Status200OK)
        .WithTags("Reviews");

        reviewsGroups.MapGet("/reviews/{reviewId}", async (int destinationId, int reviewId, SystemDbContext dbContext) =>
        {
            var review = await dbContext.Reviews
                .FirstOrDefaultAsync(r => r.Id == reviewId && r.Destination.Id == destinationId);
            return review == null ? Results.NotFound() : TypedResults.Ok(review.ToDto());
        })
        .WithName("GetReviewById")
        .Produces<ReviewDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Reviews");

        reviewsGroups.MapPost("/reviews", async (int destinationId, CreateReviewDto dto, SystemDbContext dbContext) => 
            {
            var destination = await dbContext.Destinations.FindAsync(destinationId);
            
            if (destination == null)
            {
                return Results.NotFound();
            }
            var review = new Review
            {
                Title = dto.Title,
                Content = dto.Content,
                Rating = 0,
                LikesCount = 0,
                CreatedOn = DateTimeOffset.UtcNow,
                Destination = destination,
                UserId = ""
            };
            
            dbContext.Reviews.Add(review);
            await dbContext.SaveChangesAsync();
            return TypedResults.Created($"api/destinations/{destinationId}/reviews/{review.Id}", review.ToDto());
        })
        .WithName("CreateReview")
        .Produces<ReviewDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status422UnprocessableEntity)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Reviews");

        reviewsGroups.MapPut("/reviews/{reviewID}", async (int destinationId, UpdateReviewDto dto, int reviewId, SystemDbContext dbContext) =>
        {
            var review = await dbContext.Reviews
                .FirstOrDefaultAsync(r => r.Id == reviewId && r.Destination.Id == destinationId);
            if (review == null)
            {
                return Results.NotFound();
            }
            review.Title = dto.Title;
            review.Content = dto.Content;
            dbContext.Reviews.Update(review);
            await dbContext.SaveChangesAsync();
            return TypedResults.Ok(review.ToDto());
    
        })
        .WithName("UpdateReview")
        .Produces<ReviewDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status422UnprocessableEntity)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Reviews");

        reviewsGroups.MapDelete("/reviews/{reviewId}", async (int destinationId, int reviewId, SystemDbContext dbContext) =>
        {
            var review = await dbContext.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.Destination.Id == destinationId);
            if (review == null)
            {
                return Results.NotFound();
            }
            dbContext.Reviews.Remove(review);
            await dbContext.SaveChangesAsync();
            return TypedResults.NoContent();
        })
        .WithName("DeleteReview")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Reviews");
    }
    
    public static void AddCommentApi(this WebApplication app)
    {
        var commentsGroups = app.MapGroup("/api/destinations/{destinationId}/reviews/{reviewId}").AddFluentValidationAutoValidation();

        commentsGroups.MapGet("/comments", async (int destinationId, int reviewId, SystemDbContext dbContext) =>
        {
            return await dbContext.Comments
                .Where(comment => comment.Review.Id == reviewId && comment.Review.Destination.Id == destinationId)
                .ToListAsync()
                .ContinueWith(task => task.Result.Select(comment => comment.ToDto()));
        })
        .WithName("GetComments")
        .Produces<IEnumerable<CommentDto>>(StatusCodes.Status200OK)
        .WithTags("Comments");

        commentsGroups.MapGet("/comments/{commentId}", async (int destinationId, int reviewId, int commentId, SystemDbContext dbContext) =>
        {
            var comment = await dbContext.Comments
                .FirstOrDefaultAsync(c => c.Id == commentId && c.Review.Id == reviewId && c.Review.Destination.Id == destinationId);
            return comment == null ? Results.NotFound() : TypedResults.Ok(comment.ToDto());
        })
        .WithName("GetCommentById")
        .Produces<CommentDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Comments");

        commentsGroups.MapPost("/comments", async (int destinationId, int reviewId, CreateCommentDto dto, SystemDbContext dbContext) =>
        {
            var review = await dbContext.Reviews
                .Include(r => r.Destination) // Ensure destination is included
                .FirstOrDefaultAsync(r => r.Id == reviewId && r.Destination.Id == destinationId);

            if (review == null)
            {
                return Results.NotFound("Review or Destination not found.");
            }
            
            var comment = new Comment
            {
                Text = dto.Text,
                CreatedOn = DateTimeOffset.UtcNow,
                Review = review,
                UserId = ""
            };
            dbContext.Comments.Add(comment);
    
            await dbContext.SaveChangesAsync();

            return TypedResults.Created($"api/destinations/{destinationId}/reviews/{reviewId}/comments/{comment.Id}", comment.ToDto());
        })
        .WithName("CreateComment")
        .Produces<CommentDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status422UnprocessableEntity)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Comments");

        commentsGroups.MapPut("/comments/{commentID}", async (int destinationId, int reviewId, UpdateCommentDto dto, int commentId, SystemDbContext dbContext) =>
        {
            var comment = await dbContext.Comments
                .FirstOrDefaultAsync(c => c.Id == commentId && c.Review.Id == reviewId && c.Review.Destination.Id == destinationId);
            
            if (comment == null)
            {
                return Results.NotFound();
            }
            
            comment.Text = dto.Text;
            dbContext.Comments.Update(comment);
            await dbContext.SaveChangesAsync();
            
            return TypedResults.Ok(comment.ToDto());
        })
        .WithName("UpdateComment")
        .Produces<CommentDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status422UnprocessableEntity)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Comments");

        commentsGroups.MapDelete("/comments/{commentId}", async (int destinationId, int reviewId, int commentId, SystemDbContext dbContext) =>
        {
            var comment = await dbContext.Comments
                .FirstOrDefaultAsync(c => c.Id == commentId && c.Review.Id == reviewId && c.Review.Destination.Id == destinationId);
            
            if (comment == null)
            {
                return Results.NotFound();
            }
            
            dbContext.Comments.Remove(comment);
            await dbContext.SaveChangesAsync();
            return TypedResults.NoContent();
        })
        .WithName("DeleteComment")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .WithTags("Comments");
    }
}