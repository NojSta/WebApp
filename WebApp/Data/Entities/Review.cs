﻿namespace WebApp.Data.Entities;

public class Review
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required int Rating { get; set; }
    public required int LikesCount { get; set; }
    public required DateTimeOffset CreatedOn { get; set; }
    
    public Destination Destination { get; set; }

    public ReviewDto ToDto()
    {
        return new ReviewDto(Id, Title, Content, Rating, LikesCount, CreatedOn);
    }
}