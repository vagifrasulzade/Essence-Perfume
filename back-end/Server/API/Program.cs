using API;
using API.Data;
using API.DTOs.AuthDTOs;
using API.DTOs.ContactDTOs;
using API.DTOs.OrderDTOs;
using API.DTOs.ProductDTOs;
using API.Helpers;
using API.Mapper;
using API.Models;
using API.Services.Implementations;
using API.Services.Interfaces;
using API.Validation.AuthValidations;
using API.Validation.ContactValidations;
using API.Validation.OrderValidations;
using API.Validation.ProductValidations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to use port 5000
builder.WebHost.UseUrls("http://localhost:5000");

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase));
    });


builder.Services.AddEndpointsApiExplorer();

// Database
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Perfume_DB"));
});

// AutoMapper
builder.Services.AddAutoMapper(
    opt=>{ 
        opt.AddProfile<ContactMP>();
        opt.AddProfile<AuthMP>();
        opt.AddProfile<ProductMP>();
        opt.AddProfile<OrderMP>();
    });

// Validation

//Contact 
builder.Services.AddScoped<IValidator<ContactCreateDTO>, CreateContactValidator>();
builder.Services.AddScoped<IValidator<ContactUpdateDTO>, UpdateContactValidator>();

//Auth 
builder.Services.AddScoped<IValidator<CreateUserDTO>,CreateUserValidator>();
builder.Services.AddScoped<IValidator<UpdateUserDTO>,UpdateUserValidator>();
builder.Services.AddScoped<IValidator<ChangePasswordDTO>,ChangePasswordValidator>();

//Product
builder.Services.AddScoped<IValidator<ProductCreateDTO>, CreateProductValidator>();
builder.Services.AddScoped<IValidator<ProductUpdateDTO>, UpdateProductValidator>();


//Order
builder.Services.AddScoped<IValidator<OrderCreateDTO>, CreateOrderValidator>();
builder.Services.AddScoped<IValidator<OrderUpdateDTO>, UpdateOrderValidator>();
builder.Services.AddScoped<IValidator<OrderShippingUpdateDTO>, OrderShippingUpdateValidator>();


// Services
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();

// JWT Authentication
builder.Services.AddJwtAuthentication(builder.Configuration);

// Swagger
builder.Services.AddSwagger();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// Seed default admin user - don't block startup if this fails
try
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();
        try
        {
            var context = services.GetRequiredService<AppDbContext>();
            // Test database connection
            await context.Database.CanConnectAsync();
            await DatabaseSeeder.SeedDefaultAdminAsync(context);
            logger.LogInformation("Database seeding completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Database seeding failed. Application will continue to start.");
        }
    }
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogWarning(ex, "Could not create scope for database seeding. Application will continue to start.");
}

app.MapControllers();

try
{
    app.Run();
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogCritical(ex, "Application failed to start");
    throw;
}
