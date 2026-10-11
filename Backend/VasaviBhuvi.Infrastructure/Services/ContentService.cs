
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.Infrastructure.Services;

public sealed class ContentService : IContentService
{
    private readonly AppDbContext _db;

    public ContentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ProjectContentDto?> GetProjectAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.Projects
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.SortOrder)
            .Select(x => new ProjectContentDto(
                x.Id,
                x.Name,
                x.Tagline,
                x.Description,
                x.Address,
                x.ReraNumber,
                x.HeroImagePath,
                x.BrochurePath))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<FloorPlanDto>> GetFloorPlansAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.FloorPlans
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.SortOrder)
            .Select(x => new FloorPlanDto(
                x.Id,
                x.Type,
                x.Facing,
                x.Title,
                x.AreaSqFt,
                x.ImagePath,
                x.FeaturesJson))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AmenityDto>> GetAmenitiesAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.Amenities
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.SortOrder)
            .Select(x => new AmenityDto(
                x.Id,
                x.Name,
                x.Category,
                x.Description,
                x.ImagePath))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<GalleryImageDto>> GetGalleryAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.GalleryImages
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.SortOrder)
            .Select(x => new GalleryImageDto(
                x.Id,
                x.Title,
                x.Category,
                x.ImagePath,
                x.AltText))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<SpecificationDto>> GetSpecificationsAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.Specifications
            .AsNoTracking()
            .Where(x => x.IsPublished)
            .OrderBy(x => x.SortOrder)
            .Select(x => new SpecificationDto(
                x.Id,
                x.Category,
                x.Name,
                x.Description))
            .ToListAsync(cancellationToken);
    }
}
