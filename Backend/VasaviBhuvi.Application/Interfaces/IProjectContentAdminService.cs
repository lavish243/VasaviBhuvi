
using System;
using System.Threading.Tasks;
using VasaviBhuvi.Application.DTOs.Content;

namespace VasaviBhuvi.Application.Interfaces;

public interface IProjectContentAdminService
{
    Task<AdminProjectContentDto?> GetAsync();

    Task<AdminProjectContentDto> UpdateAsync(
        ProjectContentRequestDto request);
}
