using System.ComponentModel.DataAnnotations;
using WebApp.Auth.Model;

namespace WebApp.Data.Entities;

public class Destination
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Content { get; set; }

    [Required]
    public required string UserId { get; set; }
    
    public ForumUser User { get; set; }
    
    public DestinationDto ToDto()
    {
        return new DestinationDto(Id, Name, Content);
    }
}