
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
[Route("api/admin/uploads")]
[Authorize(Roles = "Admin")]
public sealed class AdminUploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public AdminUploadsController(
        IWebHostEnvironment environment,
        IConfiguration configuration)
    {
        _environment = environment;
        _configuration = configuration;
    }

    [HttpPost("image")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadImage(
        IFormFile? file)
    {
        var maxBytes = GetMaxBytes("MaxImageSizeMB", 5);

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Select an image file." });

        if (file.Length > maxBytes)
            return BadRequest(new { message = "Image exceeds the size limit." });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

        if (!allowedExtensions.Contains(extension))
            return BadRequest(new { message = "Only JPG, PNG, and WebP images are allowed." });

        await using var stream = file.OpenReadStream();
        var header = new byte[12];
        var bytesRead = await stream.ReadAsync(header, 0, header.Length);

        if (!IsValidImage(header, bytesRead, extension))
            return BadRequest(new { message = "The file is not a valid supported image." });

        return await SaveFileAsync(file, "images", extension);
    }

    [HttpPost("document")]
    [RequestSizeLimit(15 * 1024 * 1024)]
    public async Task<IActionResult> UploadDocument(
        IFormFile? file)
    {
        var maxBytes = GetMaxBytes("MaxDocumentSizeMB", 15);

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Select a PDF file." });

        if (file.Length > maxBytes)
            return BadRequest(new { message = "Document exceeds the size limit." });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (extension != ".pdf")
            return BadRequest(new { message = "Only PDF documents are allowed." });

        await using var stream = file.OpenReadStream();
        var header = new byte[5];
        var bytesRead = await stream.ReadAsync(header, 0, header.Length);

        if (bytesRead != 5 ||
            System.Text.Encoding.ASCII.GetString(header) != "%PDF-")
        {
            return BadRequest(new { message = "The file is not a valid PDF." });
        }

        return await SaveFileAsync(file, "documents", extension);
    }

    private async Task<IActionResult> SaveFileAsync(
        IFormFile file,
        string folder,
        string extension)
    {
        var configuredRoot =
            _configuration["FileStorage:UploadRoot"] ?? "uploads";

        // Keep the configured upload directory inside the application's
        // web root so saved files can be served as static files.
        var webRoot = _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var uploadRoot = Path.GetFullPath(
            Path.Combine(webRoot, configuredRoot));

        var destinationFolder = Path.GetFullPath(
            Path.Combine(uploadRoot, folder));

        if (!destinationFolder.StartsWith(
                uploadRoot + Path.DirectorySeparatorChar,
                StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Invalid upload directory." });
        }

        Directory.CreateDirectory(destinationFolder);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(destinationFolder, fileName);

        await using (var output = new FileStream(
            filePath, FileMode.CreateNew, FileAccess.Write))
        {
            await file.CopyToAsync(output);
        }

        var relativePath = $"{configuredRoot.Trim('/').Trim('\\')}/{folder}/{fileName}"
            .Replace('\\', '/');

        var publicUrl = "/" + relativePath.TrimStart('/');

        return Ok(new
        {
            fileName,
            path = publicUrl,
            message = "File uploaded successfully."
        });
    }

    private long GetMaxBytes(string settingName, int defaultMb)
    {
        var configuredMb = _configuration.GetValue<int?>(
            $"FileStorage:{settingName}") ?? defaultMb;

        // Do not allow invalid or unexpectedly large configuration values.
        configuredMb = Math.Clamp(configuredMb, 1, 50);

        return (long)configuredMb * 1024 * 1024;
    }

    private static bool IsValidImage(
        byte[] header,
        int bytesRead,
        string extension)
    {
        if (extension is ".jpg" or ".jpeg")
        {
            return bytesRead >= 3 &&
                   header[0] == 0xFF &&
                   header[1] == 0xD8 &&
                   header[2] == 0xFF;
        }

        if (extension == ".png")
        {
            return bytesRead >= 8 &&
                   header[0] == 0x89 &&
                   header[1] == 0x50 &&
                   header[2] == 0x4E &&
                   header[3] == 0x47 &&
                   header[4] == 0x0D &&
                   header[5] == 0x0A &&
                   header[6] == 0x1A &&
                   header[7] == 0x0A;
        }

        if (extension == ".webp")
        {
            return bytesRead >= 12 &&
                   System.Text.Encoding.ASCII.GetString(header, 0, 4) == "RIFF" &&
                   System.Text.Encoding.ASCII.GetString(header, 8, 4) == "WEBP";
        }

        return false;
    }
}
