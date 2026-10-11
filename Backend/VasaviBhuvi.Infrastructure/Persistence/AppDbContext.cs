using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using VasaviBhuvi.Domain.Entities;

namespace VasaviBhuvi.Infrastructure.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<ProjectContent> Projects => Set<ProjectContent>();
    public DbSet<FloorPlan> FloorPlans => Set<FloorPlan>();
    public DbSet<Amenity> Amenities => Set<Amenity>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<Specification> Specifications => Set<Specification>();
    public DbSet<Enquiry> Enquiries => Set<Enquiry>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<PageSectionContent> PageSectionContents => Set<PageSectionContent>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<AppUser>().Property(x => x.FullName).HasMaxLength(100);
        builder.Entity<ProjectContent>().Property(x => x.Name).HasMaxLength(200);
        builder.Entity<FloorPlan>().Property(x => x.AreaSqFt).HasPrecision(10, 2);
        builder.Entity<FloorPlan>().Property(x => x.Type).HasMaxLength(30);
        builder.Entity<FloorPlan>().Property(x => x.Facing).HasMaxLength(30);
        builder.Entity<Amenity>().Property(x => x.Name).HasMaxLength(150);
        builder.Entity<GalleryImage>().Property(x => x.ImagePath).HasMaxLength(500);
        builder.Entity<Specification>().Property(x => x.Category).HasMaxLength(100);
        builder.Entity<Enquiry>().Property(x => x.Status).HasMaxLength(30);
        builder.Entity<SiteSetting>().HasIndex(x => x.Key).IsUnique();
        builder.Entity<SiteSetting>().Property(x => x.Key).HasMaxLength(150);
        builder.Entity<PageSectionContent>().Property(x => x.SectionKey).HasMaxLength(100);
        builder.Entity<PageSectionContent>().Property(x => x.Title).HasMaxLength(250);
        builder.Entity<PageSectionContent>().Property(x => x.Subtitle).HasMaxLength(500);
        builder.Entity<PageSectionContent>().Property(x => x.ImagePath).HasMaxLength(500);
        builder.Entity<PageSectionContent>().Property(x => x.SecondaryImagePath).HasMaxLength(500);
        builder.Entity<PageSectionContent>().Property(x => x.ButtonText).HasMaxLength(150);
        builder.Entity<PageSectionContent>().Property(x => x.ButtonUrl).HasMaxLength(1000);
        builder.Entity<PageSectionContent>().HasIndex(x => new { x.SectionKey, x.SortOrder });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<ContentEntity>())
            if (entry.State == EntityState.Modified) entry.Entity.UpdatedAtUtc = DateTime.UtcNow;
        return base.SaveChangesAsync(cancellationToken);
    }
}
