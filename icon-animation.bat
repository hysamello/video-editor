@echo off
:: Adjust this path if Git Bash is installed elsewhere
set "BASH_PATH=C:\Program Files\Git\bin\bash.exe"

if not exist "%BASH_PATH%" (
    echo Git Bash not found at "%BASH_PATH%"
    pause
    exit /b 1
)

"%BASH_PATH%" "%~dp0icon-animation.sh"
pause
