FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project file
COPY Server.sln ./
COPY API/API.csproj API/

# Restore dependencies
RUN dotnet restore Server.sln

# Copy the rest of the files
COPY . ./

# Publish the application (without --no-restore to avoid cached path issues)
RUN dotnet publish API/API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish ./

# Set the port
ENV ASPNETCORE_URLS=http://+:5034
EXPOSE 5034

ENTRYPOINT ["dotnet", "API.dll"]