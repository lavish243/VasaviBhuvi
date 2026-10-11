
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
[Route("api/admin/amenities")]
[Authorize(Roles = "Admin")]
public sealed class AdminAmenitiesController : ControllerBase
{
    private readonly IAmenityAdminService _service;

    public AdminAmenitiesController(IAmenityAdminService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        return Ok(await _service.GetAllAsync(cancellationToken));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _service.GetByIdAsync(id, cancellationToken);

        return result is null
            ? NotFound(new { message = "Amenity not found." })
            : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] AmenityRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _service.CreateAsync(request, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] AmenityRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _service.UpdateAsync(
            id, request, cancellationToken);

        return result is null
            ? NotFound(new { message = "Amenity not found." })
            : Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var deleted = await _service.DeleteAsync(id, cancellationToken);

        return deleted
            ? NoContent()
            : NotFound(new { message = "Amenity not found." });
    }
}
