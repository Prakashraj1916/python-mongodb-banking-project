@echo off
title Start MongoDB Server
echo Checking permissions...

net session >nul 2>&1
if %errorlevel% == 0 (
    echo Running with Administrator privileges.
    echo Starting MongoDB service...
    net start MongoDB
    echo.
    echo MongoDB Service is now RUNNING!
    echo You can now run: uvicorn app:app --reload
    pause
) else (
    echo Administrator privileges required. Requesting elevation...
    powershell -Command "Start-Process cmd -ArgumentList '/c net start MongoDB && echo. && echo MongoDB is started successfully! Press any key to close... && pause' -Verb RunAs"
)
