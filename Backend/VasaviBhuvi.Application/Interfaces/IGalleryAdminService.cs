
using VasaviBhuvi.Application.DTOs.Content;

namespace VasaviBhuvi.Application.Interfaces;

public interface IGalleryAdminService
{
    Task<IReadOnlyList<AdminGalleryImageDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<AdminGalleryImageDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<AdminGalleryImageDto> CreateAsync(
        GalleryImageRequestDto request,
        CancellationToken cancellationToken = default);

    Task<AdminGalleryImageDto?> UpdateAsync(
        Guid id,
        GalleryImageRequestDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
