
using VasaviBhuvi.Application.DTOs.Content;

namespace VasaviBhuvi.Application.Interfaces;

public interface IAmenityAdminService
{
    Task<IReadOnlyList<AdminAmenityDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<AdminAmenityDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<AdminAmenityDto> CreateAsync(
        AmenityRequestDto request,
        CancellationToken cancellationToken = default);

    Task<AdminAmenityDto?> UpdateAsync(
        Guid id,
        AmenityRequestDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
