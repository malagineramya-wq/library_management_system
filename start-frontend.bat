@echo off
title Library Management - Frontend Client
cd /d "%~dp0client"
echo ============================================
echo   Starting Frontend Client (Port 5173)...
echo ============================================
echo.
npm run dev
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Frontend stopped with error.
  pause
)

