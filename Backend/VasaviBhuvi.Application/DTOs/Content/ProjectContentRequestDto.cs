
using System;
using System.ComponentModel.DataAnnotations;

namespace VasaviBhuvi.Application.DTOs.Content;

public sealed class ProjectContentRequestDto
{
    [Required, StringLength(150)]
    public string Name { get; set; } = "Vasavi Bhuvi";

    [StringLength(300)]
    public string Tagline { get; set; } = string.Empty;

    [StringLength(5000)]
    public string Description { get; set; } = string.Empty;

    [StringLength(500)]
    public string Address { get; set; } = string.Empty;

    [StringLength(100)]
    public string? ReraNumber { get; set; }

    [StringLength(1000)]
    public string? HeroImagePath { get; set; }

    [StringLength(1000)]
    public string? BrochurePath { get; set; }

    public bool IsPublished { get; set; } = true;

    public int SortOrder { get; set; }
}

public sealed record AdminProjectContentDto(
    Guid Id,
    string Name,
    string Tagline,
    string Description,
    string Address,
    string? ReraNumber,
    string? HeroImagePath,
    string? BrochurePath,
    bool IsPublished,
    int SortOrder,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc
);
