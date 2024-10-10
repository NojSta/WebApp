namespace WebApp.Data.Entities;

public class Comment
{
    public int Id { get; set; }
    public required string Text { get; set; }
    public DateTimeOffset CreatedOn { get; set; }
    
    public Review Review { get; set; }
}