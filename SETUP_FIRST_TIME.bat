@echo off
TITLE UNI-VERIFY - First Time Setup
COLOR 0B
cls

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║          UNI-VERIFY - FIRST TIME SETUP                   ║
echo  ║      Project Originality Validation Portal              ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
echo  This will install all dependencies and create admin account.
echo  Please wait, this may take 5-10 minutes...
echo.
echo  ══════════════════════════════════════════════════════════
echo.

REM ══════════════════════════════════════════════
REM  Check Prerequisites
REM ══════════════════════════════════════════════
echo  [STEP 1/6] Checking prerequisites...
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    COLOR 0C
    echo    ❌ ERROR: Python not found!
    echo.
    echo    Please install Python 3.8 or higher from:
    echo    https://www.python.org/downloads/
    echo.
    echo    Make sure to check "Add Python to PATH" during installation.
    echo.
    pause
    exit /b 1
)
echo    ✅ Python found
python --version

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    COLOR 0C
    echo    ❌ ERROR: Node.js not found!
    echo.
    echo    Please install Node.js 18 or higher from:
    echo    https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo    ✅ Node.js found
node --version

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    COLOR 0C
    echo    ❌ ERROR: npm not found!
    echo.
    pause
    exit /b 1
)
echo    ✅ npm found
npm --version

echo.
echo  ══════════════════════════════════════════════════════════
echo.

REM ══════════════════════════════════════════════
REM  Create Required Directories
REM ══════════════════════════════════════════════
echo  [STEP 2/6] Creating required directories...
echo.

if not exist "backend\uploads" mkdir backend\uploads
if not exist "backend\data_warehouse" mkdir backend\data_warehouse

echo    ✅ Directories created
echo.
echo  ══════════════════════════════════════════════════════════
echo.

REM ══════════════════════════════════════════════
REM  Setup Python Virtual Environment
REM ══════════════════════════════════════════════
echo  [STEP 3/6] Setting up Python backend...
echo.

cd backend

REM Remove old virtual environment if exists
if exist ".venv" (
    echo    Removing old virtual environment...
    rmdir /s /q .venv
)

echo    Creating virtual environment...
python -m venv .venv

if %errorlevel% neq 0 (
    COLOR 0C
    echo    ❌ ERROR: Failed to create virtual environment!
    cd ..
    pause
    exit /b 1
)

echo    ✅ Virtual environment created

echo    Installing Python dependencies...
echo    (This may take a few minutes, please wait...)
echo.

call .venv\Scripts\activate.bat
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

if %errorlevel% neq 0 (
    COLOR 0C
    echo    ❌ ERROR: Failed to install Python dependencies!
    cd ..
    pause
    exit /b 1
)

echo.
echo    ✅ Python dependencies installed

cd ..

echo.
echo  ══════════════════════════════════════════════════════════
echo.

REM ══════════════════════════════════════════════
REM  Setup Node.js Frontend
REM ══════════════════════════════════════════════
echo  [STEP 4/6] Setting up Next.js frontend...
echo.

cd frontend

REM Remove old node_modules if exists
if exist "node_modules" (
    echo    Removing old node_modules...
    rmdir /s /q node_modules
)

echo    Installing Node.js dependencies...
echo    (This may take a few minutes, please wait...)
echo.

call npm install --silent

if %errorlevel% neq 0 (
    COLOR 0C
    echo    ❌ ERROR: Failed to install Node.js dependencies!
    cd ..
    pause
    exit /b 1
)

echo.
echo    ✅ Node.js dependencies installed

cd ..

echo.
echo  ══════════════════════════════════════════════════════════
echo.

REM ══════════════════════════════════════════════
REM  Initialize Database
REM ══════════════════════════════════════════════
echo  [STEP 5/6] Initializing database...
echo.

cd backend

REM Delete old database if exists
if exist "uni_verify.db" (
    echo    Removing old database...
    del uni_verify.db
)

echo    Creating new database...
call .venv\Scripts\activate.bat
python -c "from database import init_db; init_db(); print('Database initialized!')"

if %errorlevel% neq 0 (
    COLOR 0C
    echo    ❌ ERROR: Failed to initialize database!
    cd ..
    pause
    exit /b 1
)

echo    ✅ Database initialized

cd ..

echo.
echo  ══════════════════════════════════════════════════════════
echo.

REM ══════════════════════════════════════════════
REM  Create Admin Account
REM ══════════════════════════════════════════════
echo  [STEP 6/6] Creating admin account...
echo.

cd backend
call .venv\Scripts\activate.bat

echo admin>temp_input.txt
echo admin@univerify.com>>temp_input.txt
echo admin123>>temp_input.txt

python create_admin.py < temp_input.txt

del temp_input.txt

cd ..

echo.
echo  ══════════════════════════════════════════════════════════
echo.

REM ══════════════════════════════════════════════
REM  Setup Complete
REM ══════════════════════════════════════════════
COLOR 0A
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║              ✅ SETUP COMPLETED SUCCESSFULLY!            ║
echo  ║                                                          ║
echo  ╠══════════════════════════════════════════════════════════╣
echo  ║                                                          ║
echo  ║  Admin Account Created:                                  ║
echo  ║    Email:    admin@univerify.com                         ║
echo  ║    Password: admin123                                    ║
echo  ║                                                          ║
echo  ╠══════════════════════════════════════════════════════════╣
echo  ║                                                          ║
echo  ║  Next Steps:                                             ║
echo  ║    1. Double-click START.bat to launch the application   ║
echo  ║    2. Browser will open automatically                    ║
echo  ║    3. Login with admin credentials above                 ║
echo  ║                                                          ║
echo  ║  To stop the application, double-click STOP.bat          ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

REM Create a setup completion marker
echo Setup completed on %date% %time% > .setup_complete

pause
