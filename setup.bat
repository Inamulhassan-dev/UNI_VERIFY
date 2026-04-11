@echo off
TITLE UNI-VERIFY Setup
COLOR 0B
cls

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║            UNI-VERIFY — FIRST TIME SETUP                 ║
echo  ║         Project Originality Validation Portal             ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
echo  This script will install everything you need to run UNI-VERIFY.
echo  Please wait while we set things up...
echo.
echo ──────────────────────────────────────────────────────────────
echo.

REM ══════════════════════════════════════════════
REM  STEP 1: Check Python
REM ══════════════════════════════════════════════
echo  [1/6] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    COLOR 0C
    echo.
    echo  ╔══════════════════════════════════════════════════════╗
    echo  ║  ERROR: Python is not installed or not in PATH!      ║
    echo  ║                                                      ║
    echo  ║  Please install Python 3.10+ from:                   ║
    echo  ║  https://www.python.org/downloads/                   ║
    echo  ║                                                      ║
    echo  ║  IMPORTANT: Check "Add Python to PATH" during        ║
    echo  ║  installation!                                       ║
    echo  ╚══════════════════════════════════════════════════════╝
    echo.
    pause
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VER=%%i
echo         Found Python %PYTHON_VER%
echo.

REM ══════════════════════════════════════════════
REM  STEP 2: Check Node.js
REM ══════════════════════════════════════════════
echo  [2/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    COLOR 0C
    echo.
    echo  ╔══════════════════════════════════════════════════════╗
    echo  ║  ERROR: Node.js is not installed or not in PATH!     ║
    echo  ║                                                      ║
    echo  ║  Please install Node.js v18+ from:                   ║
    echo  ║  https://nodejs.org/                                 ║
    echo  ╚══════════════════════════════════════════════════════╝
    echo.
    pause
    exit /b 1
)
for /f %%i in ('node --version 2^>^&1') do set NODE_VER=%%i
echo         Found Node.js %NODE_VER%
echo.

REM ══════════════════════════════════════════════
REM  STEP 3: Create Python Virtual Environment
REM ══════════════════════════════════════════════
echo  [3/6] Setting up Python virtual environment...
if not exist "backend\.venv" (
    python -m venv backend\.venv
    if %errorlevel% neq 0 (
        echo         ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo         Virtual environment created successfully.
) else (
    echo         Virtual environment already exists. Skipping...
)
echo.

REM ══════════════════════════════════════════════
REM  STEP 4: Install Python Dependencies
REM ══════════════════════════════════════════════
echo  [4/6] Installing Python dependencies...
echo         This may take a few minutes (downloading ML libraries)...
echo.
call backend\.venv\Scripts\activate.bat
pip install -r backend\requirements.txt --quiet --disable-pip-version-check
if %errorlevel% neq 0 (
    COLOR 0C
    echo.
    echo         ERROR: Failed to install Python dependencies!
    echo         Please check your internet connection and try again.
    pause
    exit /b 1
)
echo         Python dependencies installed successfully.
echo.

REM ══════════════════════════════════════════════
REM  STEP 5: Pre-download ML Model
REM ══════════════════════════════════════════════
echo  [5/6] Downloading ML model (all-MiniLM-L6-v2)...
echo         First run may take 1-2 minutes...
echo.
python -c "from sentence_transformers import SentenceTransformer; print('  Downloading model...'); m = SentenceTransformer('all-MiniLM-L6-v2'); print('         ML Model downloaded and cached successfully.')"
if %errorlevel% neq 0 (
    COLOR 0E
    echo.
    echo         WARNING: ML model download failed.
    echo         The model will be downloaded automatically when you first start the app.
    echo.
)
echo.

REM ══════════════════════════════════════════════
REM  STEP 6: Install Frontend Dependencies
REM ══════════════════════════════════════════════
echo  [6/6] Installing frontend dependencies (npm install)...
echo         This may take 1-2 minutes...
echo.
cd frontend
call npm install --loglevel=error
if %errorlevel% neq 0 (
    COLOR 0C
    echo.
    echo         ERROR: Failed to install frontend dependencies!
    echo         Please check your internet connection and try again.
    cd ..
    pause
    exit /b 1
)
cd ..
echo         Frontend dependencies installed successfully.
echo.

REM ══════════════════════════════════════════════
REM  Create Required Directories
REM ══════════════════════════════════════════════
if not exist "backend\uploads" mkdir backend\uploads
if not exist "backend\data_warehouse" mkdir backend\data_warehouse

REM ══════════════════════════════════════════════
REM  SUCCESS
REM ══════════════════════════════════════════════
COLOR 0A
cls
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║          SETUP COMPLETE — UNI-VERIFY IS READY!           ║
echo  ║                                                          ║
echo  ╠══════════════════════════════════════════════════════════╣
echo  ║                                                          ║
echo  ║   Python:    %PYTHON_VER%                                ║
echo  ║   Node.js:   %NODE_VER%                                  ║
echo  ║   Backend:   Dependencies installed                      ║
echo  ║   Frontend:  Dependencies installed                      ║
echo  ║   ML Model:  Downloaded and cached                       ║
echo  ║                                                          ║
echo  ╠══════════════════════════════════════════════════════════╣
echo  ║                                                          ║
echo  ║   NEXT STEP:  Double-click  start.bat  to launch!       ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
pause
