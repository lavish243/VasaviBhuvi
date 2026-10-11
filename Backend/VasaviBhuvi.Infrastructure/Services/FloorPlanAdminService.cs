
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.Infrastructure.Services;

public sealed class FloorPlanAdminService : IFloorPlanAdminService
{
    private readonly AppDbContext _db;

    public FloorPlanAdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<AdminFloorPlanDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _db.FloorPlans
            .AsNoTracking()
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Title)
            .Select(x => new AdminFloorPlanDto(
                x.Id, x.Type, x.Facing, x.Title, x.AreaSqFt,
                x.ImagePath, x.FeaturesJson, x.IsPublished,
                x.SortOrder, x.CreatedAtUtc, x.UpdatedAtUtc))
            .ToListAsync(cancellationToken);
    }

    public async Task<AdminFloorPlanDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _db.FloorPlans
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new AdminFloorPlanDto(
                x.Id, x.Type, x.Facing, x.Title, x.AreaSqFt,
                x.ImagePath, x.FeaturesJson, x.IsPublished,
                x.SortOrder, x.CreatedAtUtc, x.UpdatedAtUtc))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<AdminFloorPlanDto> CreateAsync(
        FloorPlanRequestDto request,
        CancellationToken cancellationToken = default)
    {
        ValidateFeaturesJson(request.FeaturesJson);

        var now = DateTime.UtcNow;

        var floorPlan = new FloorPlan
        {
            Type = request.Type.Trim(),
            Facing = request.Facing.Trim(),
            Title = request.Title.Trim(),
            AreaSqFt = request.AreaSqFt,
            ImagePath = request.ImagePath,
            FeaturesJson = request.FeaturesJson,
            IsPublished = request.IsPublished,
            SortOrder = request.SortOrder,
            CreatedAtUtc = now,
            UpdatedAtUtc = now
        };

        _db.FloorPlans.Add(floorPlan);
        await _db.SaveChangesAsync(cancellationToken);

        return ToDto(floorPlan);
    }

    public async Task<AdminFloorPlanDto?> UpdateAsync(
        Guid id,
        FloorPlanRequestDto request,
        CancellationToken cancellationToken = default)
    {
        ValidateFeaturesJson(request.FeaturesJson);

        var floorPlan = await _db.FloorPlans
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (floorPlan is null)
            return null;

        floorPlan.Type = request.Type.Trim();
        floorPlan.Facing = request.Facing.Trim();
        floorPlan.Title = request.Title.Trim();
        floorPlan.AreaSqFt = request.AreaSqFt;
        floorPlan.ImagePath = request.ImagePath;
        floorPlan.FeaturesJson = request.FeaturesJson;
        floorPlan.IsPublished = request.IsPublished;
        floorPlan.SortOrder = request.SortOrder;
        floorPlan.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return ToDto(floorPlan);
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var floorPlan = await _db.FloorPlans
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (floorPlan is null)
            return false;

        _db.FloorPlans.Remove(floorPlan);
        await _db.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static AdminFloorPlanDto ToDto(FloorPlan x)
    {
        return new AdminFloorPlanDto(
            x.Id, x.Type, x.Facing, x.Title, x.AreaSqFt,
            x.ImagePath, x.FeaturesJson, x.IsPublished,
            x.SortOrder, x.CreatedAtUtc, x.UpdatedAtUtc);
    }

    private static void ValidateFeaturesJson(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            throw new ArgumentException("FeaturesJson must be a JSON array.");

        try
        {
            using var document = JsonDocument.Parse(json);

            if (document.RootElement.ValueKind != JsonValueKind.Array)
                throw new ArgumentException(
                    "FeaturesJson must contain a JSON array, for example [\"Balcony\",\"Parking\"].");
        }
        catch (JsonException)
        {
            throw new ArgumentException(
                "FeaturesJson is not valid JSON. Use an array such as [\"Balcony\",\"Parking\"].");
        }
    }
}
