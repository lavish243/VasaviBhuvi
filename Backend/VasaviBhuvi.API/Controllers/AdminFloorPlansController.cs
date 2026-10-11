
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VasaviBhuvi.Application.DTOs.Content;
using VasaviBhuvi.Application.Interfaces;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
[Route("api/admin/floor-plans")]
[Authorize(Roles = "Admin")]
public sealed class AdminFloorPlansController : ControllerBase
{
    private readonly IFloorPlanAdminService _service;

    public AdminFloorPlansController(IFloorPlanAdminService service)
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
            ? NotFound(new { message = "Floor plan not found." })
            : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] FloorPlanRequestDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _service.CreateAsync(
                request, cancellationToken);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Id },
                result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] FloorPlanRequestDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _service.UpdateAsync(
                id, request, cancellationToken);

            return result is null
                ? NotFound(new { message = "Floor plan not found." })
                : Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var deleted = await _service.DeleteAsync(id, cancellationToken);

        return deleted
            ? NoContent()
            : NotFound(new { message = "Floor plan not found." });
    }
}
