@echo off
REM Startup script for Windows - Runs both backend and frontend

echo Starting Coding Interview Platform...
echo.
echo Installing dependencies...
call npm run install:all

if errorlevel 1 (
    echo Error installing dependencies
    pause
    exit /b 1
)

echo.
echo Starting services...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
call npm run dev

pause
