using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
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
var app = builder.Build();


/*
    /api/v1/topics GET List 200
    /api/v1/topics POST Create 201
    /api/v1/topics/{id} GET One 200
    /api/v1/topics/{id} PUT/PATCH Modify 200
    /api/v1/topics/{id} DELETE Remove 200/204
 */

app.AddDestinationApi();

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


