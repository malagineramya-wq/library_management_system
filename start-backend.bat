@echo off
title Library Management - Backend Server
cd /d "%~dp0server"
echo ============================================
echo   Starting Backend Server (Port 5000)...
echo ============================================
echo.
npm start
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Server stopped with error.
  pause
)

