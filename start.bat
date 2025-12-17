@echo off
echo ========================================
echo   Perfume Project - Docker Run
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

echo Starting all containers...
echo This may take a few minutes on first run...
echo.

docker-compose up --build

pause

