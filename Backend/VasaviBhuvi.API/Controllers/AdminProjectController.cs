
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
[Route("api/admin/project")]
[Authorize(Roles = "Admin")]
public sealed class AdminProjectController : ControllerBase
{
    private readonly IProjectContentAdminService _service;

    public AdminProjectController(IProjectContentAdminService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var project = await _service.GetAsync();

        if (project == null)
        {
            return NotFound(new
            {
                message = "Project details have not been created yet."
            });
        }

        return Ok(project);
    }

    [HttpPut]
    public async Task<IActionResult> Update(
        [FromBody] ProjectContentRequestDto request)
    {
        var result = await _service.UpdateAsync(request);
        return Ok(result);
    }
}
