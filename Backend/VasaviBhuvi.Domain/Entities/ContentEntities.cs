namespace VasaviBhuvi.Domain.Entities;

public abstract class ContentEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public bool IsPublished { get; set; } = true;
    public int SortOrder { get; set; }
}

public sealed class ProjectContent : ContentEntity
{
    public string Name { get; set; } = "Vasavi Bhuvi";
    public string Tagline { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? ReraNumber { get; set; }
    public string? HeroImagePath { get; set; }
    public string? BrochurePath { get; set; }
}

public sealed class FloorPlan : ContentEntity
{
    public string Type { get; set; } = string.Empty;
    public string Facing { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public decimal AreaSqFt { get; set; }
    public string? ImagePath { get; set; }
    public string FeaturesJson { get; set; } = "[]";
}

public sealed class Amenity : ContentEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImagePath { get; set; }
}

public sealed class GalleryImage : ContentEntity
{
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string? AltText { get; set; }
}

public sealed class Specification : ContentEntity
{
    public string Category { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public sealed class Enquiry
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Configuration { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = "New";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? UserId { get; set; }
}

public sealed class SiteSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public bool IsPublic { get; set; } = true;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
public sealed class PageSectionContent : ContentEntity
{
    public string SectionKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImagePath { get; set; }
    public string? SecondaryImagePath { get; set; }
    public string? ButtonText { get; set; }
    public string? ButtonUrl { get; set; }
    public string ContentJson { get; set; } = "{}";
}