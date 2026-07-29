2@echo off
title DrapeAI Launcher
echo ========================================================
echo               Launching DrapeAI Application             
echo ========================================================
echo.

echo Cleaning port 8080 if previously occupied...
powershell -Command "Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo Starting Spring Boot Backend (Port 8080)...
start "DrapeAI Backend (Spring Boot)" cmd /k "cd /d drapeai-backend && mvn spring-boot:run"

echo Starting React Frontend (Port 5173)...
start "DrapeAI Frontend (Vite)" cmd /k "cd /d drapeai-frontend && npm run dev"

echo.
echo Both servers are launching in separate windows!
echo - Backend: http://localhost:8080
echo - Frontend: http://localhost:5173
echo.
pause
