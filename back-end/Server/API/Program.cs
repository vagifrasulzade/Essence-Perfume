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

// Configure Kestrel - will use ASPNETCORE_URLS environment variable if set (for Docker)
// Otherwise defaults to port 5000 for local development
if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
{
    builder.WebHost.UseUrls("http://localhost:5000");
}

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
    // Try Docker connection string first, then fall back to local development
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                          ?? builder.Configuration.GetConnectionString("Perfume_DB");
    opt.UseSqlServer(connectionString);
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

// CORS - Allow frontend from different sources (local and Docker)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000", 
                "http://localhost:3001",
                "http://frontend:3000",  // Docker container name
                "http://127.0.0.1:3000"
              )
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

// Database migration and seeding - retry logic for Docker startup
try
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();
        var context = services.GetRequiredService<AppDbContext>();
        
        // Retry logic for database connection (important for Docker)
        var maxRetries = 10;
        var retryCount = 0;
        var connected = false;
        
        while (!connected && retryCount < maxRetries)
        {
            try
            {
                logger.LogInformation($"Attempting to connect to database (attempt {retryCount + 1}/{maxRetries})...");
                await context.Database.CanConnectAsync();
                connected = true;
                logger.LogInformation("Successfully connected to database.");
            }
            catch (Exception ex)
            {
                retryCount++;
                if (retryCount >= maxRetries)
                {
                    logger.LogError(ex, "Failed to connect to database after {MaxRetries} attempts. Application will start but may not function correctly.", maxRetries);
                    throw;
                }
                logger.LogWarning("Database connection failed. Retrying in 5 seconds... (attempt {RetryCount}/{MaxRetries})", retryCount, maxRetries);
                await Task.Delay(5000);
            }
        }
        
        // Run migrations
        try
        {
            logger.LogInformation("Running database migrations...");
            await context.Database.MigrateAsync();
            logger.LogInformation("Database migrations completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Database migrations failed. Application will continue to start.");
        }
        
        // Seed default data
        try
        {
            logger.LogInformation("Seeding database...");
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
    logger.LogWarning(ex, "Database initialization failed. Application will continue to start.");
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
