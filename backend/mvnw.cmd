@REM ----------------------------------------------------------------------------
@REM LinkLytics Maven Wrapper script for Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%..\"

if exist "%ROOT_DIR%.tools\apache-maven-3.9.9\bin\mvn.cmd" (
    call "%ROOT_DIR%.tools\apache-maven-3.9.9\bin\mvn.cmd" %*
) else (
    where mvn >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        call mvn %*
    ) else (
        echo [ERROR] Maven not found! Please ensure Apache Maven is in PATH or installed in .tools\
        exit /b 1
    )
)
