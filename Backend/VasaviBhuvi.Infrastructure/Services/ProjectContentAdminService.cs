
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.Infrastructure.Services;

public sealed class ProjectContentAdminService
    : IProjectContentAdminService
{
    private readonly AppDbContext _db;

    public ProjectContentAdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AdminProjectContentDto?> GetAsync()
    {
        var project = await _db.Projects
            .OrderByDescending(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync();

        return project == null ? null : Map(project);
    }

    public async Task<AdminProjectContentDto> UpdateAsync(
        ProjectContentRequestDto request)
    {
        var project = await _db.Projects
            .OrderByDescending(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync();

        if (project == null)
        {
            project = new ProjectContent();
            _db.Projects.Add(project);
        }

        project.Name = request.Name.Trim();
        project.Tagline = request.Tagline.Trim();
        project.Description = request.Description.Trim();
        project.Address = request.Address.Trim();
        project.ReraNumber = request.ReraNumber?.Trim();
        project.HeroImagePath = request.HeroImagePath?.Trim();
        project.BrochurePath = request.BrochurePath?.Trim();
        project.IsPublished = request.IsPublished;
        project.SortOrder = request.SortOrder;
        project.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Map(project);
    }

    private static AdminProjectContentDto Map(ProjectContent project)
    {
        return new AdminProjectContentDto(
            project.Id,
            project.Name,
            project.Tagline,
            project.Description,
            project.Address,
            project.ReraNumber,
            project.HeroImagePath,
            project.BrochurePath,
            project.IsPublished,
            project.SortOrder,
            project.CreatedAtUtc,
            project.UpdatedAtUtc
        );
    }
}
