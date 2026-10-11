using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
[Route("api/floorplans")]
public sealed class FloorPlansController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] string? type, CancellationToken cancellationToken)
    {
        var query = db.FloorPlans.AsNoTracking().Where(x => x.IsPublished);
        if (!string.IsNullOrWhiteSpace(type)) query = query.Where(x => x.Type == type);
        var rows = await query.OrderBy(x => x.SortOrder).Select(x => new
        {
            x.Id, x.Type, x.Facing, x.Title, x.AreaSqFt, x.ImagePath,
            Features = JsonSerializer.Deserialize<string[]>(x.FeaturesJson) ?? Array.Empty<string>()
        }).ToListAsync(cancellationToken);
        return Ok(rows);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateFloorPlanRequest request, CancellationToken cancellationToken)
    {
        var entity = new FloorPlan { Type = request.Type.Trim(), Facing = request.Facing.Trim(), Title = request.Title.Trim(), AreaSqFt = request.AreaSqFt, ImagePath = request.ImagePath, FeaturesJson = JsonSerializer.Serialize(request.Features), SortOrder = request.SortOrder, IsPublished = request.IsPublished };
        db.FloorPlans.Add(entity);
        await db.SaveChangesAsync(cancellationToken);
        return Created($"/api/floorplans/{entity.Id}", new { entity.Id });
    }
}

public sealed record CreateFloorPlanRequest(string Type, string Facing, string Title, decimal AreaSqFt, string? ImagePath, string[] Features, int SortOrder = 0, bool IsPublished = true);
