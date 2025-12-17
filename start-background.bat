@echo off
echo ========================================
echo   Perfume Project - Docker Run
echo   (Background Mode)
echo ========================================
echo.

echo Checking if Docker is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running!
echo.

echo Starting all containers in background...
echo.

docker-compose up -d --build

echo.
echo ========================================
echo   Containers are running!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5034
echo Database: localhost:1433
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.

pause

