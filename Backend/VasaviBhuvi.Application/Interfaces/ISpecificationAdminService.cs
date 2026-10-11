
using VasaviBhuvi.Application.DTOs.Content;

namespace VasaviBhuvi.Application.Interfaces;

public interface ISpecificationAdminService
{
    Task<IReadOnlyList<AdminSpecificationDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<AdminSpecificationDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<AdminSpecificationDto> CreateAsync(
        SpecificationRequestDto request,
        CancellationToken cancellationToken = default);

    Task<AdminSpecificationDto?> UpdateAsync(
        Guid id,
        SpecificationRequestDto request,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
