
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
[Route("api/admin/specifications")]
[Authorize(Roles = "Admin")]
public sealed class AdminSpecificationsController : ControllerBase
{
    private readonly ISpecificationAdminService _service;

    public AdminSpecificationsController(
        ISpecificationAdminService service)
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
            ? NotFound(new { message = "Specification not found." })
            : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] SpecificationRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _service.CreateAsync(
            request, cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Id },
            result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] SpecificationRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _service.UpdateAsync(
            id, request, cancellationToken);

        return result is null
            ? NotFound(new { message = "Specification not found." })
            : Ok(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var deleted = await _service.DeleteAsync(
            id, cancellationToken);

        return deleted
            ? NoContent()
            : NotFound(new { message = "Specification not found." });
    }
}
