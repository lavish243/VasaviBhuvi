
using VasaviBhuvi.Application.DTOs.Content;

namespace VasaviBhuvi.Application.Interfaces;

public interface IFloorPlanAdminService
{
    Task<IReadOnlyList<AdminFloorPlanDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<AdminFloorPlanDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<AdminFloorPlanDto> CreateAsync(
        FloorPlanRequestDto request,
        CancellationToken cancellationToken = default);

    Task<AdminFloorPlanDto?> UpdateAsync(
        Guid id,
        FloorPlanRequestDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
