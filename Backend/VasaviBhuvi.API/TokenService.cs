using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using VasaviBhuvi.API.Options;
using VasaviBhuvi.Application.DTOs;
using VasaviBhuvi.Application.Interfaces;


namespace VasaviBhuvi.API;

public sealed class TokenService(IOptions<JwtOptions> jwtOptions) : ITokenService
{
    public Task<AuthResponse> CreateTokenAsync(string userId, string? email, string fullName, IList<string> roles, CancellationToken cancellationToken = default)
    {
        var options = jwtOptions.Value;
        var expires = DateTime.UtcNow.AddMinutes(options.AccessTokenMinutes);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(JwtRegisteredClaimNames.Email, email ?? string.Empty),
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Name, fullName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SigningKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(options.Issuer, options.Audience, claims, expires: expires, signingCredentials: credentials);
        return Task.FromResult(new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), expires, userId, email ?? string.Empty, fullName, roles.ToArray()));
    }
}
