
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Backend/VasaviBhuvi.Domain/VasaviBhuvi.Domain.csproj Backend/VasaviBhuvi.Domain/
COPY Backend/VasaviBhuvi.Application/VasaviBhuvi.Application.csproj Backend/VasaviBhuvi.Application/
COPY Backend/VasaviBhuvi.Infrastructure/VasaviBhuvi.Infrastructure.csproj Backend/VasaviBhuvi.Infrastructure/
COPY Backend/VasaviBhuvi.API/VasaviBhuvi.API.csproj Backend/VasaviBhuvi.API/

RUN dotnet restore Backend/VasaviBhuvi.API/VasaviBhuvi.API.csproj

COPY Backend/ Backend/

RUN dotnet publish Backend/VasaviBhuvi.API/VasaviBhuvi.API.csproj \
    --configuration Release \
    --output /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "VasaviBhuvi.API.dll"]
