
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VasaviBhuvi.Application.Interfaces;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public sealed class ContentController : ControllerBase
{
    private readonly IContentService _contentService;

    public ContentController(IContentService contentService)
    {
        _contentService = contentService;
    }

    [HttpGet("project")]
    public async Task<IActionResult> GetProject(
        CancellationToken cancellationToken)
    {
        var project = await _contentService.GetProjectAsync(
            cancellationToken);

        if (project is null)
        {
            return NotFound(new
            {
                message = "No published project content was found."
            });
        }

        return Ok(project);
    }

    [HttpGet("floor-plans")]
    public async Task<IActionResult> GetFloorPlans(
        CancellationToken cancellationToken)
    {
        var result = await _contentService.GetFloorPlansAsync(
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("amenities")]
    public async Task<IActionResult> GetAmenities(
        CancellationToken cancellationToken)
    {
        var result = await _contentService.GetAmenitiesAsync(
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("gallery")]
    public async Task<IActionResult> GetGallery(
        CancellationToken cancellationToken)
    {
        var result = await _contentService.GetGalleryAsync(
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("specifications")]
    public async Task<IActionResult> GetSpecifications(
        CancellationToken cancellationToken)
    {
        var result = await _contentService.GetSpecificationsAsync(
            cancellationToken);

        return Ok(result);
    }
}
