using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
public sealed class PageSectionsController(AppDbContext db) : ControllerBase
{
    [HttpGet("api/page-sections")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublished([FromQuery] string? sectionKey, CancellationToken ct)
    {
        var query = db.PageSectionContents.AsNoTracking().Where(x => x.IsPublished);
        if (!string.IsNullOrWhiteSpace(sectionKey))
            query = query.Where(x => x.SectionKey == sectionKey.Trim());
        return Ok(await query.OrderBy(x => x.SortOrder).ThenBy(x => x.Title).ToListAsync(ct));
    }

    [HttpGet("api/page-sections/{sectionKey}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublishedByKey(string sectionKey, CancellationToken ct)
    {
        var rows = await db.PageSectionContents.AsNoTracking()
            .Where(x => x.IsPublished && x.SectionKey == sectionKey)
            .OrderBy(x => x.SortOrder).ToListAsync(ct);
        return rows.Count == 0 ? NotFound(new { message = "Published page section not found." }) : Ok(rows[0]);
    }

    [HttpGet("api/admin/page-sections")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll(CancellationToken ct) =>
        Ok(await db.PageSectionContents.AsNoTracking().OrderBy(x => x.SectionKey).ThenBy(x => x.SortOrder).ToListAsync(ct));

    [HttpPost("api/admin/page-sections")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] PageSectionRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.SectionKey) || string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Section key and title are required." });
        var entity = new PageSectionContent();
        Apply(entity, request);
        db.PageSectionContents.Add(entity);
        await db.SaveChangesAsync(ct);
        return Created($"/api/admin/page-sections/{entity.Id}", entity);
    }

    [HttpPut("api/admin/page-sections/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] PageSectionRequest request, CancellationToken ct)
    {
        var entity = await db.PageSectionContents.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return NotFound(new { message = "Page section not found." });
        if (string.IsNullOrWhiteSpace(request.SectionKey) || string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(new { message = "Section key and title are required." });
        Apply(entity, request);
        await db.SaveChangesAsync(ct);
        return Ok(entity);
    }

    [HttpDelete("api/admin/page-sections/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var entity = await db.PageSectionContents.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return NotFound(new { message = "Page section not found." });
        db.PageSectionContents.Remove(entity);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    private static void Apply(PageSectionContent entity, PageSectionRequest request)
    {
        entity.SectionKey = request.SectionKey.Trim();
        entity.Title = request.Title.Trim();
        entity.Subtitle = request.Subtitle?.Trim() ?? string.Empty;
        entity.Description = request.Description?.Trim() ?? string.Empty;
        entity.ImagePath = Clean(request.ImagePath);
        entity.SecondaryImagePath = Clean(request.SecondaryImagePath);
        entity.ButtonText = Clean(request.ButtonText);
        entity.ButtonUrl = Clean(request.ButtonUrl);
        entity.ContentJson = string.IsNullOrWhiteSpace(request.ContentJson) ? "{}" : request.ContentJson;
        entity.SortOrder = request.SortOrder;
        entity.IsPublished = request.IsPublished;
    }
    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

public sealed class PageSectionRequest
{
    public string SectionKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
    public string? SecondaryImagePath { get; set; }
    public string? ButtonText { get; set; }
    public string? ButtonUrl { get; set; }
    public string? ContentJson { get; set; } = "{}";
    public int SortOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}
