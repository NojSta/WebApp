namespace WebApp.Data.Entities;

public class Destination
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Content { get; set; }

    public DestinationDto ToDto()
    {
        return new DestinationDto(Id, Name, Content);
    }
}