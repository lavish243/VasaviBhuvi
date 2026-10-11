
using System.ComponentModel.DataAnnotations;

namespace VasaviBhuvi.Application.DTOs.Content;

public sealed class GalleryImageRequestDto
{
    [Required, StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Category { get; set; } = string.Empty;

    [Required, StringLength(500)]
    public string ImagePath { get; set; } = string.Empty;

    [StringLength(250)]
    public string? AltText { get; set; }

    public bool IsPublished { get; set; } = true;

    public int SortOrder { get; set; }
}

public sealed record AdminGalleryImageDto(
    Guid Id,
    string Title,
    string Category,
    string ImagePath,
    string? AltText,
    bool IsPublished,
    int SortOrder,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc
);
