
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using VasaviBhuvi.Application.Interfaces;
using VasaviBhuvi.Infrastructure.Persistence;
using VasaviBhuvi.Infrastructure.Services;

namespace VasaviBhuvi.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Connection string 'DefaultConnection' is missing.");

        services.AddDbContext<AppDbContext>(options =>
            options
                .UseNpgsql(connectionString)
                .EnableDetailedErrors()
                .LogTo(
                    Console.WriteLine,
                    LogLevel.Information));

        services.AddScoped<IContentService, ContentService>();
        services.AddScoped<IAdminDashboardService, AdminDashboardService>();
        services.AddScoped<IFloorPlanAdminService, FloorPlanAdminService>();
        services.AddScoped<IAmenityAdminService, AmenityAdminService>();
        services.AddScoped<IGalleryAdminService, GalleryAdminService>();
        services.AddScoped<ISpecificationAdminService, SpecificationAdminService>();
        services.AddScoped<IProjectContentAdminService, ProjectContentAdminService>();

        return services;
    }
}
