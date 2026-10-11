# Vasavi Bhuvi — Full Project (API + React Frontend)

This package combines the React/Vite website and the ASP.NET Core API. It includes the source images and existing API upload files, plus fixes for the missing Page Sections API and machine-specific project references.

## Requirements
- Node.js 20+ and npm
- .NET 10 SDK
- PostgreSQL 16+

## 1. Configure and run the API
Open a terminal in `Backend`. Configure secrets in `Backend/VasaviBhuvi.API` (PowerShell):

```powershell
cd .\VasaviBhuvi.API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=vasavi_bhuvi;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"
dotnet user-secrets set "Jwt:SigningKey" "YOUR_RANDOM_SECRET_AT_LEAST_32_BYTES_LONG"
dotnet user-secrets set "BootstrapAdmin:Email" "admin@example.com"
dotnet user-secrets set "BootstrapAdmin:Password" "YOUR_STRONG_ADMIN_PASSWORD"
dotnet user-secrets set "BootstrapAdmin:FullName" "Vasavi Bhuvi Administrator"
```

Then from `Backend` run:

```powershell
dotnet restore
dotnet ef database update --project .\VasaviBhuvi.Infrastructure\VasaviBhuvi.Infrastructure.csproj --startup-project .\VasaviBhuvi.API\VasaviBhuvi.API.csproj
dotnet run --project .\VasaviBhuvi.API\VasaviBhuvi.API.csproj
```

The configured API HTTPS URL is `https://localhost:58389`; Swagger is available at `/swagger` in Development and `/health` is the health check. If HTTPS certificate warnings appear, trust the local ASP.NET certificate with `dotnet dev-certs https --trust`.

## 2. Run the frontend
In a second terminal:

```powershell
cd Frontend
npm ci
npm run dev
```

Frontend `.env` points to `https://localhost:58389/api`. Change `VITE_API_BASE_URL` if the API runs on another URL. Restart Vite after changing `.env`.

## 3. Image storage and dynamic content
- Local design/fallback assets are in `Frontend/public/images`; references use `/images/...` and are served by Vite or the production frontend host.
- Admin image uploads are written under `Backend/VasaviBhuvi.API/wwwroot/uploads/images` and returned as `/uploads/images/<generated-file>`. The frontend resolves `/uploads/...` paths against the API origin.
- Uploads require an Admin JWT and are handled by `POST /api/admin/uploads/image` (multipart form field `file`). PDF uploads use `POST /api/admin/uploads/document`.
- Public API-backed content endpoints include `/api/Content/project`, `/api/Content/floor-plans`, `/api/Content/amenities`, `/api/Content/gallery`, `/api/Content/specifications`, plus public `/api/page-sections`. Admin CRUD endpoints require the Admin role.
- Some page copy and layout details intentionally retain local fallback content when the database has no published records. Populate the admin content tables for those API-backed sections to make them database-driven. A successful upload alone does not add an image to a gallery or floor plan: save the returned path in the relevant content record.

## Important
The backend expects PostgreSQL and the .NET 10 SDK. Ensure the database is running and migrations have been applied before expecting live API data. Never commit database passwords, JWT signing keys, or admin credentials.
