
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.Infrastructure.Services;

public sealed class AmenityAdminService : IAmenityAdminService
{
    private readonly AppDbContext _db;

    public AmenityAdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<AdminAmenityDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.Amenities
            .AsNoTracking()
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Name)
            .Select(x => new AdminAmenityDto(
                x.Id,
                x.Name,
                x.Category,
                x.Description,
                x.ImagePath,
                x.IsPublished,
                x.SortOrder,
                x.CreatedAtUtc,
                x.UpdatedAtUtc))
            .ToListAsync(cancellationToken);
    }

    public async Task<AdminAmenityDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _db.Amenities
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new AdminAmenityDto(
                x.Id,
                x.Name,
                x.Category,
                x.Description,
                x.ImagePath,
                x.IsPublished,
                x.SortOrder,
                x.CreatedAtUtc,
                x.UpdatedAtUtc))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<AdminAmenityDto> CreateAsync(
        AmenityRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        var amenity = new Amenity
        {
            Name = request.Name.Trim(),
            Category = request.Category.Trim(),
            Description = request.Description.Trim(),
            ImagePath = request.ImagePath,
            IsPublished = request.IsPublished,
            SortOrder = request.SortOrder,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        _db.Amenities.Add(amenity);
        await _db.SaveChangesAsync(cancellationToken);

        return ToDto(amenity);
    }

    public async Task<AdminAmenityDto?> UpdateAsync(
        Guid id,
        AmenityRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var amenity = await _db.Amenities
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (amenity is null)
            return null;

        amenity.Name = request.Name.Trim();
        amenity.Category = request.Category.Trim();
        amenity.Description = request.Description.Trim();
        amenity.ImagePath = request.ImagePath;
        amenity.IsPublished = request.IsPublished;
        amenity.SortOrder = request.SortOrder;
        amenity.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return ToDto(amenity);
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var amenity = await _db.Amenities
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (amenity is null)
            return false;

        _db.Amenities.Remove(amenity);
        await _db.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static AdminAmenityDto ToDto(Amenity x)
    {
        return new AdminAmenityDto(
            x.Id,
            x.Name,
            x.Category,
            x.Description,
            x.ImagePath,
            x.IsPublished,
            x.SortOrder,
            x.CreatedAtUtc,
            x.UpdatedAtUtc);
    }
}
