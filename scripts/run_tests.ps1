# Run comprehensive AI4Brain test suite across all merged subsystems
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Running AI4Brain Unified Test Suites (Agent + Coach)... " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$backendDir = Join-Path $repoRoot "backend"
$agentPartVenv = Join-Path $repoRoot "..\Agent Part\ai4brain-main\backend\.venv\Scripts\python.exe"
$localVenv = Join-Path $backendDir ".venv\Scripts\python.exe"

$pythonExe = "python"
if (Test-Path $localVenv) {
    $pythonExe = $localVenv
} elseif (Test-Path $agentPartVenv) {
    $pythonExe = $agentPartVenv
}

$env:PYTHONPATH = "$backendDir;$repoRoot;$repoRoot\src"

Write-Host "`n[1/3] Running AI Agent Psychometric & Task Generator Tests..." -ForegroundColor Yellow
& $pythonExe -m pytest (Join-Path $backendDir "tests") -v

Write-Host "`n[2/3] Running AI Coach Module Tests..." -ForegroundColor Yellow
& $pythonExe -m pytest (Join-Path $repoRoot "tests") -v

Write-Host "`n[3/3] Running Assessment Engine Ingestion Tests..." -ForegroundColor Yellow
$env:PYTHONPATH = (Join-Path $repoRoot "assessment_engine\api")
& $pythonExe -m pytest (Join-Path $repoRoot "assessment_engine\api\tests") -v

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " All AI4Brain Unified Test Suites Completed! " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
