using API.Services.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services.Implementations;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;

    public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
    {
        _logger = logger;

        var cloudName = configuration["Cloudinary:CloudName"];
        var apiKey = configuration["Cloudinary:ApiKey"];
        var apiSecret = configuration["Cloudinary:ApiSecret"];

        if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
        {
            throw new InvalidOperationException("Cloudinary configuration is missing in appsettings.json");
        }

        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<(string Url, string PublicId)?> UploadImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            _logger.LogWarning("File is null or empty");
            return null;
        }

        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
        {
            _logger.LogWarning($"Invalid file type: {file.ContentType}");
            throw new InvalidOperationException("Only image files (JPEG, PNG, GIF, WebP) are allowed");
        }

        // Validate file size (max 10MB)
        if (file.Length > 10 * 1024 * 1024)
        {
            _logger.LogWarning($"File size too large: {file.Length} bytes");
            throw new InvalidOperationException("File size must not exceed 10MB");
        }

        try
        {
            using var stream = file.OpenReadStream();
            
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "perfume-shop/products",
                Transformation = new Transformation()
                    .Width(1000)
                    .Height(1000)
                    .Crop("limit")
                    .Quality("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                _logger.LogError($"Cloudinary upload error: {uploadResult.Error.Message}");
                throw new Exception($"Image upload failed: {uploadResult.Error.Message}");
            }

            _logger.LogInformation($"Image uploaded successfully: {uploadResult.SecureUrl}");
            return (uploadResult.SecureUrl.ToString(), uploadResult.PublicId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading image to Cloudinary");
            throw;
        }
    }

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        if (string.IsNullOrEmpty(publicId))
        {
            _logger.LogWarning("PublicId is null or empty");
            return false;
        }

        try
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);

            if (result.Result == "ok")
            {
                _logger.LogInformation($"Image deleted successfully: {publicId}");
                return true;
            }

            _logger.LogWarning($"Failed to delete image: {publicId}, Result: {result.Result}");
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting image from Cloudinary: {publicId}");
            return false;
        }
    }
}

