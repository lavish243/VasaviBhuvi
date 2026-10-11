
using System.ComponentModel.DataAnnotations;

namespace VasaviBhuvi.Application.DTOs.Content;

public sealed class SpecificationRequestDto
{
    [Required, StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required, StringLength(2000)]
    public string Description { get; set; } = string.Empty;

    public bool IsPublished { get; set; } = true;

    public int SortOrder { get; set; }
}

public sealed record AdminSpecificationDto(
    Guid Id,
    string Category,
    string Name,
    string Description,
    bool IsPublished,
    int SortOrder,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc
);
