@echo off
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 20.9 or later from https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing project dependencies. Internet connection is needed the first time.
  call npm install
  if errorlevel 1 (
    echo npm install failed. Check the error messages above.
    pause
    exit /b 1
  )
)
echo Opening FineTune Lab at http://localhost:3000
start http://localhost:3000
call npm run dev
pause
