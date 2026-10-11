
namespace VasaviBhuvi.Application.DTOs.Content;

public sealed record ProjectContentDto(
    Guid Id,
    string Name,
    string Tagline,
    string Description,
    string Address,
    string? ReraNumber,
    string? HeroImagePath,
    string? BrochurePath
);

public sealed record FloorPlanDto(
    Guid Id,
    string Type,
    string Facing,
    string Title,
    decimal AreaSqFt,
    string? ImagePath,
    string FeaturesJson
);

public sealed record AmenityDto(
    Guid Id,
    string Name,
    string Category,
    string Description,
    string? ImagePath
);

public sealed record GalleryImageDto(
    Guid Id,
    string Title,
    string Category,
    string ImagePath,
    string? AltText
);

public sealed record SpecificationDto(
    Guid Id,
    string Category,
    string Name,
    string Description
);
