@echo off
title CyberOptix Enterprise Server Launcher
echo =======================================================
echo          CyberOptix Enterprise Platform Launcher       
echo =======================================================
echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "CyberOptix Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "CyberOptix Frontend" cmd /k "npm run dev"

echo.
echo All services launched!
echo - Frontend UI: http://localhost:5173
echo - Backend API: http://localhost:8000/docs
echo - Health Check: http://localhost:8000/health
echo =======================================================
pause
