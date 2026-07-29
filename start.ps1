Write-Host "========================================================" -ForegroundColor Gold
Write-Host "               Launching DrapeAI Application             " -ForegroundColor Gold
Write-Host "========================================================" -ForegroundColor Gold
Write-Host ""

Write-Host "Checking and clearing port 8080 if in use..." -ForegroundColor Yellow
try {
    $conn = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
        Write-Host "Cleared previous process on port 8080." -ForegroundColor Green
    }
} catch {}

Write-Host "Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location drapeai-backend; mvn spring-boot:run"

Write-Host "Starting React Frontend (Port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location drapeai-frontend; npm run dev"

Write-Host ""
Write-Host "Both servers launched in separate windows!" -ForegroundColor Green
Write-Host "- Backend: http://localhost:8080"
Write-Host "- Frontend: http://localhost:5173"
