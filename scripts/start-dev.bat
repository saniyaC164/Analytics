@echo off
echo Starting Cafe Analytics Development Environment...
echo.

echo Starting Flask Backend...
start "Flask Backend" cmd /k "cd /d %~dp0.. && python run.py"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting React Frontend...
start "React Frontend" cmd /k "cd /d %~dp0..\ca-frontend && npm start"

echo.
echo Development environment started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
