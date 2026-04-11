@echo off
TITLE UNI-VERIFY — Stop All Services
COLOR 0E
cls

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║           UNI-VERIFY — STOPPING ALL SERVICES             ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

set KILLED=0

REM ══════════════════════════════════════════════
REM  Stop Backend (Python / Uvicorn)
REM ══════════════════════════════════════════════
echo  [1/2] Stopping Backend Server...

REM Kill any python process running main.py
for /f "tokens=2" %%a in ('tasklist /fi "WINDOWTITLE eq UNI-VERIFY Backend Server" /fo list 2^>nul ^| findstr /i "PID:"') do (
    taskkill /PID %%a /F /T >nul 2>&1
    set KILLED=1
)

REM Also kill uvicorn processes if any
taskkill /fi "WINDOWTITLE eq UNI-VERIFY Backend*" /F >nul 2>&1 && set KILLED=1

REM Fallback: kill python processes on port 8000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING" 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
    set KILLED=1
)

echo        Backend server stopped.
echo.

REM ══════════════════════════════════════════════
REM  Stop Frontend (Node / Next.js)
REM ══════════════════════════════════════════════
echo  [2/2] Stopping Frontend Server...

REM Kill Next.js dev server window
taskkill /fi "WINDOWTITLE eq UNI-VERIFY Frontend*" /F >nul 2>&1 && set KILLED=1

REM Fallback: kill node processes on port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING" 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
    set KILLED=1
)

echo        Frontend server stopped.
echo.

REM ══════════════════════════════════════════════
REM  Summary
REM ══════════════════════════════════════════════
COLOR 0A
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║          ALL SERVICES STOPPED SUCCESSFULLY!              ║
echo  ║                                                          ║
echo  ╠══════════════════════════════════════════════════════════╣
echo  ║                                                          ║
echo  ║   Backend  (port 8000) .... STOPPED                      ║
echo  ║   Frontend (port 3000) .... STOPPED                      ║
echo  ║                                                          ║
echo  ║   To restart, double-click  start.bat                    ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
pause
