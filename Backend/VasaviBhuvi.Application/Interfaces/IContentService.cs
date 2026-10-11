
using VasaviBhuvi.Application.DTOs.Content;

namespace VasaviBhuvi.Application.Interfaces;

public interface IContentService
{
    Task<ProjectContentDto?> GetProjectAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<FloorPlanDto>> GetFloorPlansAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AmenityDto>> GetAmenitiesAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<GalleryImageDto>> GetGalleryAsync(
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<SpecificationDto>> GetSpecificationsAsync(
        CancellationToken cancellationToken = default);
}
