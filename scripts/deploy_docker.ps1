# Deploy production stack via Docker Compose
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Deploying AI4Brain Multi-Container Production Topology  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$rootDir = Join-Path $PSScriptRoot ".."
Set-Location $rootDir

docker compose up --build -d
Write-Host "Deployment initiated. Services available at:" -ForegroundColor Green
Write-Host "  - Frontend Cockpit: http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend API:      http://localhost:8000" -ForegroundColor White
Write-Host "  - API Swagger Docs: http://localhost:8000/docs" -ForegroundColor White
