
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.Infrastructure.Services;

public sealed class AdminDashboardService : IAdminDashboardService
{
    private readonly AppDbContext _db;

    public AdminDashboardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AdminDashboardDto> GetDashboardAsync(
        CancellationToken cancellationToken = default)
    {
        var projects = await _db.Projects.CountAsync(
            cancellationToken);

        var floorPlans = await _db.FloorPlans.CountAsync(
            cancellationToken);

        var amenities = await _db.Amenities.CountAsync(
            cancellationToken);

        var galleryImages = await _db.GalleryImages.CountAsync(
            cancellationToken);

        var specifications = await _db.Specifications.CountAsync(
            cancellationToken);

        var enquiries = await _db.Enquiries.CountAsync(
            cancellationToken);

        return new AdminDashboardDto(
            projects,
            floorPlans,
            amenities,
            galleryImages,
            specifications,
            enquiries);
    }
}
