using VasaviBhuvi.Application.DTOs;

namespace VasaviBhuvi.Application.Interfaces;

public interface ITokenService
{
    Task<AuthResponse> CreateTokenAsync(string userId, string? email, string fullName, IList<string> roles, CancellationToken cancellationToken = default);
}
