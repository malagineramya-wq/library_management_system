@echo off
title Library Management System Launcher
cd /d "%~dp0"

echo ===================================================
echo   Starting Library Management System
echo ===================================================
echo.

echo [1/3] Starting Backend Server (Port 5000)...
start "Library Management - Backend" "%~dp0start-backend.bat"

echo [2/3] Starting Frontend Client (Port 5173)...
start "Library Management - Frontend" "%~dp0start-frontend.bat"

echo [3/3] Waiting for servers to initialize...
timeout /t 4 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ===================================================
echo   Application is running!
echo   - Web UI:  http://localhost:5173
echo   - Backend: http://localhost:5000
echo ===================================================
echo.
echo You can minimize this window.
echo Close the opened command windows when you want to stop the servers.
pause
