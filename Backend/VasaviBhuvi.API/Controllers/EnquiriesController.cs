
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Application.DTOs;
using VasaviBhuvi.Domain.Entities;
using VasaviBhuvi.Infrastructure.Persistence;

namespace VasaviBhuvi.API.Controllers;

[ApiController]
[Route("api/enquiries")]
public sealed class EnquiriesController(AppDbContext db) : ControllerBase
{
    private static readonly string[] ValidStatuses =
    {
        "New",
        "Contacted",
        "Interested",
        "Closed"
    };

    // Public website: submit an enquiry
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create(
        CreateEnquiryRequest request,
        CancellationToken cancellationToken)
    {
        var enquiry = new Enquiry
        {
            Name = request.Name.Trim(),
            Phone = request.Phone.Trim(),
            Email = request.Email.Trim(),
            Configuration = request.Configuration?.Trim(),
            Message = request.Message?.Trim(),
            UserId = User.Identity?.IsAuthenticated == true
                ? User.FindFirstValue(ClaimTypes.NameIdentifier)
                : null
        };

        db.Enquiries.Add(enquiry);
        await db.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            enquiry.Id,
            message = "Your enquiry has been received."
        });
    }

    // Admin: get all enquiries
    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        var enquiries = await db.Enquiries
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(enquiries);
    }

    // Admin: update enquiry status
    [HttpPut("admin/{id:guid}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdateEnquiryStatusRequest request,
        CancellationToken cancellationToken)
    {
        if (request is null ||
            string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(new
            {
                message = "Status is required."
            });
        }

        var status = request.Status.Trim();

        var validStatus = ValidStatuses.FirstOrDefault(
            x => string.Equals(
                x,
                status,
                StringComparison.OrdinalIgnoreCase));

        if (validStatus is null)
        {
            return BadRequest(new
            {
                message = "Invalid status. Use New, Contacted, Interested, or Closed."
            });
        }

        var enquiry = await db.Enquiries
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (enquiry is null)
        {
            return NotFound(new
            {
                message = "Enquiry not found."
            });
        }

        enquiry.Status = validStatus;

        await db.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            enquiry.Id,
            enquiry.Status,
            message = "Enquiry status updated successfully."
        });
    }

    // Admin: delete an enquiry
    [HttpDelete("admin/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var enquiry = await db.Enquiries
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (enquiry is null)
        {
            return NotFound(new
            {
                message = "Enquiry not found."
            });
        }

        db.Enquiries.Remove(enquiry);

        await db.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            message = "Enquiry deleted successfully."
        });
    }
}

public sealed class UpdateEnquiryStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
