
namespace VasaviBhuvi.Application.DTOs.Content;

public sealed record AdminDashboardDto(
    int Projects,
    int FloorPlans,
    int Amenities,
    int GalleryImages,
    int Specifications,
    int Enquiries
);
