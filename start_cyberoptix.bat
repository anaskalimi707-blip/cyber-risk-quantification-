@echo off
title CyberOptix Enterprise Server Launcher
echo =======================================================
echo          CyberOptix Enterprise Platform Launcher       
echo =======================================================

echo [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...
start "CyberOptix Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Vite Frontend on http://127.0.0.1:5173 ...
start "CyberOptix Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo All services launching in separate windows!
echo - Frontend UI: http://localhost:5173
echo - Backend API: http://127.0.0.1:8000/docs
echo - Health Check: http://127.0.0.1:8000/health
echo =======================================================
pause
