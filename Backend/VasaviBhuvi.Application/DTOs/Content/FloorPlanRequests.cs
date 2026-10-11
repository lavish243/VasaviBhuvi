
using System.ComponentModel.DataAnnotations;

namespace VasaviBhuvi.Application.DTOs.Content;

public sealed class FloorPlanRequestDto
{
    [Required, StringLength(50)]
    public string Type { get; set; } = string.Empty;

    [Required, StringLength(50)]
    public string Facing { get; set; } = string.Empty;

    [Required, StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Range(typeof(decimal), "1", "100000")]
    public decimal AreaSqFt { get; set; }

    [StringLength(500)]
    public string? ImagePath { get; set; }

    public string FeaturesJson { get; set; } = "[]";

    public bool IsPublished { get; set; } = true;

    public int SortOrder { get; set; }
}

public sealed record AdminFloorPlanDto(
    Guid Id,
    string Type,
    string Facing,
    string Title,
    decimal AreaSqFt,
    string? ImagePath,
    string FeaturesJson,
    bool IsPublished,
    int SortOrder,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc
);
