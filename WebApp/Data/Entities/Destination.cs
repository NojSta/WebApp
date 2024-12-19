using System.ComponentModel.DataAnnotations;
using WebApp.Auth.Model;

namespace WebApp.Data.Entities;

public class Destination
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Content { get; set; }

    public byte[]? PhotoData { get; set; }  // Store the actual image bytes
    public string? PhotoContentType { get; set; }
    
    [Required]
    public required string UserId { get; set; }
    
    public ForumUser User { get; set; }
    
    public DestinationDto ToDto()
    {
        string? photoBase64 = null;
        if (PhotoData != null)
        {
            photoBase64 = $"data:{PhotoContentType};base64,{Convert.ToBase64String(PhotoData)}";
        }
        return new DestinationDto(Id, Name, Content, photoBase64);
    }
}