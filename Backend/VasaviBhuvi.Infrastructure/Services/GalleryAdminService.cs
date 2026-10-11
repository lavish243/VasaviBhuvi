
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.Infrastructure.Services;

public sealed class GalleryAdminService : IGalleryAdminService
{
    private readonly AppDbContext _db;

    public GalleryAdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<AdminGalleryImageDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.GalleryImages
            .AsNoTracking()
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Title)
            .Select(x => new AdminGalleryImageDto(
                x.Id, x.Title, x.Category, x.ImagePath, x.AltText,
                x.IsPublished, x.SortOrder, x.CreatedAtUtc, x.UpdatedAtUtc))
            .ToListAsync(cancellationToken);
    }

    public async Task<AdminGalleryImageDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _db.GalleryImages
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new AdminGalleryImageDto(
                x.Id, x.Title, x.Category, x.ImagePath, x.AltText,
                x.IsPublished, x.SortOrder, x.CreatedAtUtc, x.UpdatedAtUtc))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<AdminGalleryImageDto> CreateAsync(
        GalleryImageRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        var image = new GalleryImage
        {
            Title = request.Title.Trim(),
            Category = request.Category.Trim(),
            ImagePath = request.ImagePath.Trim(),
            AltText = request.AltText?.Trim(),
            IsPublished = request.IsPublished,
            SortOrder = request.SortOrder,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        _db.GalleryImages.Add(image);
        await _db.SaveChangesAsync(cancellationToken);

        return ToDto(image);
    }

    public async Task<AdminGalleryImageDto?> UpdateAsync(
        Guid id,
        GalleryImageRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var image = await _db.GalleryImages
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (image is null)
            return null;

        image.Title = request.Title.Trim();
        image.Category = request.Category.Trim();
        image.ImagePath = request.ImagePath.Trim();
        image.AltText = request.AltText?.Trim();
        image.IsPublished = request.IsPublished;
        image.SortOrder = request.SortOrder;
        image.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return ToDto(image);
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var image = await _db.GalleryImages
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (image is null)
            return false;

        _db.GalleryImages.Remove(image);
        await _db.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static AdminGalleryImageDto ToDto(GalleryImage x)
    {
        return new AdminGalleryImageDto(
            x.Id, x.Title, x.Category, x.ImagePath, x.AltText,
            x.IsPublished, x.SortOrder, x.CreatedAtUtc, x.UpdatedAtUtc);
    }
}
