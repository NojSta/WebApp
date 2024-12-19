using System.ComponentModel.DataAnnotations;
using WebApp.Auth.Model;

namespace WebApp.Data.Entities;

public class Review
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public required int Rating { get; set; }
    public required int LikesCount { get; set; }
    public required DateTimeOffset CreatedOn { get; set; }
    
    public byte[]? PhotoData { get; set; }  // Store the actual image bytes
    public string? PhotoContentType { get; set; }  // Store the content type (e.g., "image/jpeg")
    
    public Destination Destination { get; set; }

    [Required]
    public required string UserId { get; set; }
    
    public ForumUser User { get; set; }
    public required string userName { get; set; }
    
    public ReviewDto ToDto()
    {
        string? photoBase64 = null;
        if (PhotoData != null)
        {
            photoBase64 = $"data:{PhotoContentType};base64,{Convert.ToBase64String(PhotoData)}";
        }
        return new ReviewDto(Id, Title, Content, LikesCount, Rating, CreatedOn, userName, photoBase64);
    }
}