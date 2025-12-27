@echo off
REM ============================================
REM Political Strategy Workbench - Build Script
REM ============================================

setlocal enabledelayedexpansion

set API_DIR=backend\api-server

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="install" goto install
if "%1"=="install-frontend" goto install-frontend
if "%1"=="install-backend" goto install-backend
if "%1"=="dev-frontend" goto dev-frontend
if "%1"=="dev-backend" goto dev-backend
if "%1"=="build" goto build
if "%1"=="build-frontend" goto build-frontend
if "%1"=="build-backend" goto build-backend
if "%1"=="test" goto test
if "%1"=="db-setup" goto db-setup
if "%1"=="db-migrate" goto db-migrate
if "%1"=="db-studio" goto db-studio
if "%1"=="docker-up" goto docker-up
if "%1"=="docker-down" goto docker-down
if "%1"=="lint" goto lint
if "%1"=="clean" goto clean
if "%1"=="quick-start" goto quick-start
goto help

:help
echo Political Strategy Workbench - Build Commands
echo.
echo Installation:
echo   build install          - Install all dependencies
echo   build install-frontend - Install frontend dependencies
echo   build install-backend  - Install backend dependencies
echo.
echo Development:
echo   build dev-frontend     - Start frontend dev server
echo   build dev-backend      - Start backend dev server
echo.
echo Build:
echo   build build            - Build for production
echo   build build-frontend   - Build frontend only
echo   build build-backend    - Build backend only
echo.
echo Database:
echo   build db-setup         - Setup database
echo   build db-migrate       - Run migrations
echo   build db-studio        - Open Prisma Studio
echo.
echo Docker:
echo   build docker-up        - Start Docker containers
echo   build docker-down      - Stop Docker containers
echo.
echo Testing:
echo   build test             - Run all tests
echo   build lint             - Run linters
echo.
echo Utilities:
echo   build clean            - Clean build artifacts
echo   build quick-start      - Install + setup + start
goto end

:install
echo Installing all dependencies...
call npm install
cd %API_DIR%
call npm install
cd %~dp0
echo Dependencies installed successfully!
goto end

:install-frontend
echo Installing frontend dependencies...
call npm install
echo Frontend dependencies installed!
goto end

:install-backend
echo Installing backend dependencies...
cd %API_DIR%
call npm install
cd %~dp0
echo Backend dependencies installed!
goto end

:dev-frontend
echo Starting frontend development server...
call npm run dev
goto end

:dev-backend
echo Starting backend development server...
cd %API_DIR%
call npm run start:dev
cd %~dp0
goto end

:build
echo Building for production...
call npm run build
cd %API_DIR%
call npm run build
cd %~dp0
echo Build completed!
goto end

:build-frontend
echo Building frontend...
call npm run build
echo Frontend built!
goto end

:build-backend
echo Building backend...
cd %API_DIR%
call npm run build
cd %~dp0
echo Backend built!
goto end

:test
echo Running tests...
call npm run test -- --run
cd %API_DIR%
call npm run test
cd %~dp0
goto end

:db-setup
echo Setting up database...
cd %API_DIR%
call npm run db:setup
cd %~dp0
echo Database setup complete!
goto end

:db-migrate
echo Running database migrations...
cd %API_DIR%
call npm run prisma:migrate
cd %~dp0
goto end

:db-studio
echo Opening Prisma Studio...
cd %API_DIR%
call npm run prisma:studio
cd %~dp0
goto end

:docker-up
echo Starting Docker containers...
docker-compose -f docker-configs\docker-compose.yml up -d
echo Docker containers started!
goto end

:docker-down
echo Stopping Docker containers...
docker-compose -f docker-configs\docker-compose.yml down
goto end

:lint
echo Running linters...
call npm run lint
cd %API_DIR%
call npm run lint
cd %~dp0
goto end

:clean
echo Cleaning build artifacts...
if exist .next rmdir /s /q .next
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
cd %API_DIR%
if exist dist rmdir /s /q dist
if exist node_modules rmdir /s /q node_modules
cd %~dp0
echo Cleanup completed!
goto end

:quick-start
echo Quick Start - Political Strategy Workbench
call :install
call :db-setup
echo.
echo Setup complete! Run these commands in separate terminals:
echo   build dev-frontend
echo   build dev-backend
goto end

:end
endlocal
