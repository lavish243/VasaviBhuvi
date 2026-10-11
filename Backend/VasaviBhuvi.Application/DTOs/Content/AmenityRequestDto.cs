
using System.ComponentModel.DataAnnotations;

namespace VasaviBhuvi.Application.DTOs.Content;

public sealed class AmenityRequestDto
{
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required, StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [StringLength(500)]
    public string? ImagePath { get; set; }

    public bool IsPublished { get; set; } = true;

    public int SortOrder { get; set; }
}

public sealed record AdminAmenityDto(
    Guid Id,
    string Name,
    string Category,
    string Description,
    string? ImagePath,
    bool IsPublished,
    int SortOrder,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc
);
