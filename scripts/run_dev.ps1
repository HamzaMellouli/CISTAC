# Launch AI4Brain Backend & Frontends concurrently in development mode
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " AI4Brain Cognitive Platform — Doodle Design System Runtime " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$backendDir = Join-Path $repoRoot "backend"
$dashboardDir = Join-Path $repoRoot "dashboard_ui"
$frontendDir = Join-Path $repoRoot "frontend"

$agentPartVenv = Join-Path $repoRoot "..\Agent Part\ai4brain-main\backend\.venv\Scripts\uvicorn.exe"
$localVenv = Join-Path $backendDir ".venv\Scripts\uvicorn.exe"

$uvicornExe = "uvicorn"
if (Test-Path $localVenv) {
    $uvicornExe = $localVenv
} elseif (Test-Path $agentPartVenv) {
    $uvicornExe = $agentPartVenv
}

# Start FastAPI backend in background
Write-Host "[1/2] Starting AI Agent FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
$env:PYTHONPATH = "$backendDir;$repoRoot;$repoRoot\src"
Start-Process -FilePath $uvicornExe -ArgumentList "app.main:app", "--reload", "--host", "127.0.0.1", "--port", "8000" -WorkingDirectory $backendDir

# Start frontend
if (Test-Path (Join-Path $frontendDir "node_modules")) {
    Write-Host "[2/2] Starting SynapseTwin Frontend on http://localhost:5173..." -ForegroundColor Green
    Set-Location $frontendDir
    npm.cmd run dev
} elseif (Test-Path (Join-Path $dashboardDir "node_modules")) {
    Write-Host "[2/2] Starting Next.js Dashboard on http://localhost:3000..." -ForegroundColor Green
    Set-Location $dashboardDir
    npm.cmd run dev
} else {
    Write-Host "Please run 'npm install' in frontend or dashboard_ui to start dev servers." -ForegroundColor Yellow
}
