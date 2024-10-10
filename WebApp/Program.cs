using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Results;
using SharpGrip.FluentValidation.AutoValidation.Shared.Extensions;
using WebApp;
using WebApp.Data;
using WebApp.Data.Entities;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SystemDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation(configuration =>
{
    configuration.OverrideDefaultResultFactoryWith<ProblemDetailsResultFactory>();
});

// Add services for Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Destinations API", Version = "v1" });
});

var app = builder.Build();

// Enable middleware to serve generated Swagger as a JSON endpoint
app.UseSwagger();

// Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.)
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Destinations API V1");
});

app.AddDestinationApi(); 
app.AddReviewApi();
app.AddCommentApi();

app.Run();

public class ProblemDetailsResultFactory : IFluentValidationAutoValidationResultFactory
{
    public IResult CreateResult(EndpointFilterInvocationContext context, ValidationResult validationResult)
    {
        var problemDetails = new HttpValidationProblemDetails(validationResult.ToValidationProblemErrors())
        {
            Type = "https://tools.ietf.org/html/rfc4918#section-11.2",
            Title = "Unprocessable Entity",
            Status = 422,
        };
        return TypedResults.Problem(problemDetails);
    }
}

public record DestinationDto(int Id, string Name, string Content);
public record CreateDestinationDto(string Name, string Content)
{
    public class CreateDestinationDtoValidator : AbstractValidator<CreateDestinationDto>
    {
        public CreateDestinationDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().Length(1, 50);
            RuleFor(x => x.Content).NotEmpty().Length(5, 500);
        }
    }
};
public record UpdateDestinationDto(string Content);

public record ReviewDto(int Id, string Name, string Content, int Likes, int Rating, DateTimeOffset CreatedAt);
public record CreateReviewDto(string Title, string Content)
{
    public class CreateReviewDtoValidator : AbstractValidator<CreateReviewDto>
    {
        public CreateReviewDtoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().Length(1, 50);
            RuleFor(x => x.Content).NotEmpty().Length(5, 800);
        }
    }
};
public record UpdateReviewDto(string Title, string Content);

public record CommentDto(int Id, string Text,DateTimeOffset CreatedAt);
public record CreateCommentDto(string Text)
{
    public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator()
        {
            RuleFor(x => x.Text).NotEmpty().Length(5, 100);
        }
    }
};
public record UpdateCommentDto(string Text);

