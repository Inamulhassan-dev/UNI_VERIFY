@echo off
TITLE UNI-VERIFY Launcher
COLOR 0B
cls

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║             UNI-VERIFY — STARTING SERVICES               ║
echo  ║         Project Originality Validation Portal             ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

REM ══════════════════════════════════════════════
REM  Pre-flight Checks
REM ══════════════════════════════════════════════
echo  [PRE-FLIGHT] Checking setup...
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    COLOR 0C
    echo    ERROR: Python not found! Run setup.bat first.
    pause
    exit /b 1
)
echo    [OK] Python found.

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    COLOR 0C
    echo    ERROR: Node.js not found! Run setup.bat first.
    pause
    exit /b 1
)
echo    [OK] Node.js found.

REM Check virtual environment
if not exist "backend\.venv\Scripts\activate.bat" (
    COLOR 0C
    echo.
    echo    ERROR: Virtual environment not found!
    echo    Please run  setup.bat  first to install dependencies.
    echo.
    pause
    exit /b 1
)
echo    [OK] Python virtual environment found.

REM Check node_modules
if not exist "frontend\node_modules" (
    COLOR 0C
    echo.
    echo    ERROR: Frontend dependencies not installed!
    echo    Please run  setup.bat  first to install dependencies.
    echo.
    pause
    exit /b 1
)
echo    [OK] Frontend dependencies found.

REM Create required directories if missing
if not exist "backend\uploads" mkdir backend\uploads
if not exist "backend\data_warehouse" mkdir backend\data_warehouse

echo    [OK] Required directories verified.
echo.
echo  ──────────────────────────────────────────────────────────
echo.

REM ══════════════════════════════════════════════
REM  Start Backend
REM ══════════════════════════════════════════════
echo  [1/2] Launching Backend Server...
start "UNI-VERIFY Backend" cmd /k "title UNI-VERIFY Backend Server && color 0A && cd backend && ..\.venv\Scripts\activate.bat && echo. && echo  Starting UNI-VERIFY Backend... && echo. && python main.py"

echo        Waiting for backend to initialize...
timeout /t 5 /nobreak > nul
echo        Backend server starting on http://localhost:8000
echo.

REM ══════════════════════════════════════════════
REM  Start Frontend
REM ══════════════════════════════════════════════
echo  [2/2] Launching Frontend Server...
start "UNI-VERIFY Frontend" cmd /k "title UNI-VERIFY Frontend Server && color 0D && cd frontend && echo. && echo  Starting UNI-VERIFY Frontend... && echo. && npm run dev"

echo        Waiting for frontend to initialize...
timeout /t 5 /nobreak > nul
echo        Frontend server starting on http://localhost:3000
echo.

REM ══════════════════════════════════════════════
REM  Open Browser
REM ══════════════════════════════════════════════
echo  [AUTO] Opening browser...
timeout /t 3 /nobreak > nul
start "" http://localhost:3000

REM ══════════════════════════════════════════════
REM  Status
REM ══════════════════════════════════════════════
COLOR 0A
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║            ALL SERVICES ARE STARTING!                    ║
echo  ║                                                          ║
echo  ╠══════════════════════════════════════════════════════════╣
echo  ║                                                          ║
echo  ║   Backend API:    http://localhost:8000                  ║
echo  ║   Frontend App:   http://localhost:3000                  ║
echo  ║   API Docs:       http://localhost:8000/docs             ║
echo  ║                                                          ║
echo  ╠══════════════════════════════════════════════════════════╣
echo  ║                                                          ║
echo  ║   Two new terminal windows have opened:                  ║
echo  ║     - Green window  = Backend server                     ║
echo  ║     - Purple window = Frontend server                    ║
echo  ║                                                          ║
echo  ║   Keep them open while using the app.                    ║
echo  ║   To stop, double-click  stop.bat                        ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
pause
