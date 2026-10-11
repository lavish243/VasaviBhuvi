
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.Infrastructure.Services;

public sealed class SpecificationAdminService : ISpecificationAdminService
{
    private readonly AppDbContext _db;

    public SpecificationAdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<AdminSpecificationDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.Specifications
            .AsNoTracking()
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Category)
            .ThenBy(x => x.Name)
            .Select(x => new AdminSpecificationDto(
                x.Id, x.Category, x.Name, x.Description,
                x.IsPublished, x.SortOrder,
                x.CreatedAtUtc, x.UpdatedAtUtc))
            .ToListAsync(cancellationToken);
    }

    public async Task<AdminSpecificationDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _db.Specifications
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new AdminSpecificationDto(
                x.Id, x.Category, x.Name, x.Description,
                x.IsPublished, x.SortOrder,
                x.CreatedAtUtc, x.UpdatedAtUtc))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<AdminSpecificationDto> CreateAsync(
        SpecificationRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        var specification = new Specification
        {
            Category = request.Category.Trim(),
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            IsPublished = request.IsPublished,
            SortOrder = request.SortOrder,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        _db.Specifications.Add(specification);
        await _db.SaveChangesAsync(cancellationToken);

        return ToDto(specification);
    }

    public async Task<AdminSpecificationDto?> UpdateAsync(
        Guid id,
        SpecificationRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var specification = await _db.Specifications
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (specification is null)
            return null;

        specification.Category = request.Category.Trim();
        specification.Name = request.Name.Trim();
        specification.Description = request.Description.Trim();
        specification.IsPublished = request.IsPublished;
        specification.SortOrder = request.SortOrder;
        specification.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return ToDto(specification);
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var specification = await _db.Specifications
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (specification is null)
            return false;

        _db.Specifications.Remove(specification);
        await _db.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static AdminSpecificationDto ToDto(Specification x)
    {
        return new AdminSpecificationDto(
            x.Id, x.Category, x.Name, x.Description,
            x.IsPublished, x.SortOrder,
            x.CreatedAtUtc, x.UpdatedAtUtc);
    }
}
