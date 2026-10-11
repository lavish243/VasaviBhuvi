using System.ComponentModel.DataAnnotations;

namespace VasaviBhuvi.Application.DTOs;

public sealed class RegisterRequest
{
    [Required, StringLength(100)] public string FullName { get; init; } = string.Empty;
    [Required, EmailAddress, StringLength(256)] public string Email { get; init; } = string.Empty;
    [Required, MinLength(10), StringLength(100)] public string Password { get; init; } = string.Empty;
}

public sealed class LoginRequest
{
    [Required, EmailAddress] public string Email { get; init; } = string.Empty;
    [Required] public string Password { get; init; } = string.Empty;
}

public sealed record AuthResponse(string AccessToken, DateTime ExpiresAtUtc, string UserId, string Email, string FullName, string[] Roles);

public sealed class CreateEnquiryRequest
{
    [Required, StringLength(100)] public string Name { get; init; } = string.Empty;
    [Required, Phone, StringLength(30)] public string Phone { get; init; } = string.Empty;
    [Required, EmailAddress, StringLength(256)] public string Email { get; init; } = string.Empty;
    [StringLength(80)] public string? Configuration { get; init; }
    [StringLength(2000)] public string? Message { get; init; }
}
