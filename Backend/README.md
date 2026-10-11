# Vasavi Bhuvi API starter (.NET 10 + Onion Architecture)

This is the backend foundation for the uploaded React/Vite Vasavi Bhuvi project. It does not replace or modify the existing frontend. Current included functionality: PostgreSQL/EF Core setup, ASP.NET Core Identity, User/Admin roles, JWT login, registration, `/api/auth/me`, public floor-plan listing, Admin-only floor-plan creation, public enquiry submission, Admin-only enquiry listing, Swagger, and bootstrap admin/role seeding.

## Prerequisites
- .NET 10 SDK
- PostgreSQL 16+ (or compatible PostgreSQL server)
- `dotnet-ef` tool: `dotnet tool install --global dotnet-ef --version 10.0.0`

## 1. Set local secrets (run in VasaviBhuvi/VasaviBhuvi.API)
```powershell
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=vasavi_bhuvi;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"
dotnet user-secrets set "Jwt:SigningKey" "PASTE_A_RANDOM_SECRET_OF_AT_LEAST_32_BYTES_HERE"
dotnet user-secrets set "BootstrapAdmin:Email" "admin@yourdomain.com"
dotnet user-secrets set "BootstrapAdmin:Password" "Use-A-Strong-Unique-Password-123!"
dotnet user-secrets set "BootstrapAdmin:FullName" "Vasavi Bhuvi Administrator"
```
Generate a signing secret instead of using the example text. Keep secrets out of Git.

## 2. Create solution and add projects
Open PowerShell and enter the extracted solution folder first:
```powershell
cd .\VasaviBhuvi
dotnet new sln -n VasaviBhuvi
dotnet sln add .\VasaviBhuvi.Domain\VasaviBhuvi.Domain.csproj
dotnet sln add .\VasaviBhuvi.Application\VasaviBhuvi.Application.csproj
dotnet sln add .\VasaviBhuvi.Infrastructure\VasaviBhuvi.Infrastructure.csproj
dotnet sln add .\VasaviBhuvi.API\VasaviBhuvi.API.csproj
```
If your SDK's `dotnet new sln` creates a `.slnx` instead of `.sln`, use the generated solution filename in `dotnet sln` commands.

## 3. Restore, migrate, run
```powershell
dotnet restore
dotnet tool install --global dotnet-ef --version 10.0.0
dotnet ef migrations add InitialCreate --project .\VasaviBhuvi.Infrastructure\VasaviBhuvi.Infrastructure.csproj --startup-project .\VasaviBhuvi.API\VasaviBhuvi.API.csproj --output-dir Persistence\Migrations
dotnet ef database update --project .\VasaviBhuvi.Infrastructure\VasaviBhuvi.Infrastructure.csproj --startup-project .\VasaviBhuvi.API\VasaviBhuvi.API.csproj
dotnet run --project .\VasaviBhuvi.API\VasaviBhuvi.API.csproj
```
Open the HTTPS URL printed by the console and add `/swagger`. `/health` should return Healthy.

## 4. API quick tests
- `POST /api/auth/register`: `{ "fullName":"Test User", "email":"user@example.com", "password":"Strong-Password-123!" }`
- `POST /api/auth/login`: `{ "email":"user@example.com", "password":"Strong-Password-123!" }`
- Use the returned `accessToken` in Swagger's Authorize dialog as a Bearer token.
- `GET /api/auth/me` requires a token.
- `GET /api/floorplans` is public.
- `POST /api/floorplans` requires Admin role.
- `POST /api/enquiries` is public; `GET /api/enquiries/admin` requires Admin role.

## Important notes
- Bootstrap admin is created only when both `BootstrapAdmin:Email` and `BootstrapAdmin:Password` are set. After initial setup, remove those secret values or rotate them and protect admin role assignment carefully.
- Registration cannot choose its own role; it is assigned `User` on the server.
- Access tokens are short-lived. A production-ready refresh-token/revocation flow, email confirmation, rate limiting, and secure cookie strategy still need to be added before production.
- This starter does not yet include complete CRUD controllers for every content type, local file upload endpoints, or automatic migration of existing JS data. Those are the next implementation stages.
- Existing frontend image paths such as `/images/floor-plans/...` should be migrated/seeded carefully. Do not change React component styling while switching its data source.
