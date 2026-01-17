@echo off
echo ========================================
echo    Fantasy Luxe Store - Start All
echo ========================================
echo.

REM Check if node_modules exist, if not install dependencies
echo [1/3] Starting Backend (Port 8000)...
start "Backend" cmd /c "cd /d %~dp0backendv3 && if not exist node_modules npm install && npm start"

timeout /t 3 /nobreak > nul

echo [2/3] Starting Frontend (Port 5000)...
start "Frontend" cmd /c "cd /d %~dp0frontendv3 && if not exist node_modules npm install && npm run dev"

echo [3/3] Starting Admin Panel (Port 5173)...
start "Admin" cmd /c "cd /d %~dp0admin && if not exist node_modules npm install && npm run dev"

echo.
echo ========================================
echo    All services starting...
echo ========================================
echo.
echo    Backend:  http://localhost:8000
echo    Frontend: http://localhost:5000
echo    Admin:    http://localhost:5173
echo.
echo ========================================
echo    Press any key to close this window
echo ========================================
pause > nul
