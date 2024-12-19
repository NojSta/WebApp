using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Results;
using SharpGrip.FluentValidation.AutoValidation.Shared.Extensions;
using WebApp;
using WebApp.Auth;
using WebApp.Auth.Model;
using WebApp.Data;
using WebApp.Data.Entities;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SystemDbContext>();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation(configuration =>
{
    configuration.OverrideDefaultResultFactoryWith<ProblemDetailsResultFactory>();
});

builder.Services.AddTransient<JwtTokenService>();
builder.Services.AddTransient<SessionService>();
builder.Services.AddScoped<AuthSeeder>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", 
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});


builder.Services.AddIdentity<ForumUser, IdentityRole>()
    .AddEntityFrameworkStores<SystemDbContext>()
    .AddDefaultTokenProviders();
  
builder.Services.AddAuthentication( options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:ValidAudience"];
    options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:ValidIssuer"];
    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]));
});

builder.Services.AddAuthorization();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Destinations API", Version = "v1" });
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

var app = builder.Build();

using var scope = app.Services.CreateScope();

//var dbContext = scope.ServiceProvider.GetRequiredService<SystemDbContext>();

var dbSeeder = scope.ServiceProvider.GetRequiredService<AuthSeeder>();
await dbSeeder.SeedAsync();

app.AddAuthApi();
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
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowAll");

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

public class DestinationDto
{
    /// <example>1</example>
    public int Id { get; set; }

    /// <example>Everest</example>
    public string Name { get; set; }

    /// <example>Big mountain</example>
    public string Content { get; set; }
    public string? PhotoDataUrl { get; set; }  // Base64 data URL for the image
    public DestinationDto(int Id, string Name, string Content, string? photoDataUrl = null)
    {
        this.Id = Id;
        this.Name = Name;
        this.Content = Content;
        this.PhotoDataUrl = photoDataUrl;
    }
}

public class CreateDestinationDto
{
    /// <example>Rekyva</example>
    public string Name {get; set;}
    /// <example>Grazu</example>
    public string Content {get; set;}
    public class CreateDestinationDtoValidator : AbstractValidator<CreateDestinationDto>
    {
        public CreateDestinationDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().Length(1, 50);
            RuleFor(x => x.Content).NotEmpty().Length(5, 500);
        }
    }
};

public class UpdateDestinationDto
{
    /// <example>Very big mountain</example>
    public string Content {get; set;}
    [JsonConstructor]
    UpdateDestinationDto(string content)
    {
        this.Content = content;
    }
};

public class ReviewDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Content { get; set;}
    public int Likes { get; set; }
    public int Rating { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public string? PhotoDataUrl { get; set; }  // Base64 data URL for the image
    public string UserName {get; set;}
    

    public ReviewDto(int id, string name, string content, int likes, int rating, DateTimeOffset createdAt, string userName, string? photoDataUrl = null)
    {
        this.Id = id;
        this.Name = name;
        this.Content = content;
        this.Likes = likes;
        this.Rating = rating;
        this.CreatedAt = createdAt;
        this.PhotoDataUrl = photoDataUrl;
        this.UserName = userName;
    }
}
public class CreateReviewDto
{
    public class CreateReviewDtoValidator : AbstractValidator<CreateReviewDto>
    {
        public CreateReviewDtoValidator()
        {
            RuleFor(x => x.Title).NotEmpty().Length(1, 50);
            RuleFor(x => x.Content).NotEmpty().Length(5, 800);
        }
    }

    public CreateReviewDto(string title, string content)
    {
        Title = title;
        Content = content;
    }

    /// <example>Long journey</example>
    public string Title { get; set; }
    /// <example>Enjoyed it</example>
    public string Content { get; set; }
    
};
public class UpdateReviewDto
{
    public UpdateReviewDto(string title, string content)
    {
        Title = title;
        Content = content;
    }

    /// <example>Been there</example>
    public string Title { get; set; }
    /// <example>Really really liked it</example>
    public string Content { get; set; }


}

public class CommentDto
{
    public CommentDto(int id, string text, DateTimeOffset createdAt, string name)
    {
        Id = id;
        Text = text;
        CreatedAt = createdAt;
        Name = name;
    }
    /// <example>2</example>
    public int Id { get; set; }
    /// <example>Good review!</example>
    public string Text { get; set; }
    /// <example>2024.10.10</example>
    public DateTimeOffset CreatedAt { get; set; }
    public string Name { get; set; }

}

public class CreateCommentDto
{
    /// <example>Nice experience</example>
    public string Text { get; set; }
    public string Name { get; set; }

    public CreateCommentDto(string Text, string Name)
    {
        this.Text = Text;
        this.Name = Name;
    }
    public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator()
        {
            RuleFor(x => x.Text).NotEmpty().Length(5, 100);
        }
    }
};

public class UpdateCommentDto
{
    /// <example>Very nice review</example>
    public string Text { get; set; }

    public UpdateCommentDto(string Text)
    {
        this.Text = Text;
    }
};

