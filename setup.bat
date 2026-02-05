@echo off
echo ======================================
echo Portfolio Management System Setup
echo ======================================
echo.

REM Check Java
echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Java not found
    echo Install Java 17+ from: https://adoptium.net/
    pause
    exit /b 1
) else (
    echo + Java found
)

echo.

REM Check MySQL
echo Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ! MySQL not found
    echo Install MySQL from: https://dev.mysql.com/downloads/
) else (
    echo + MySQL found
)

echo.

REM Get MySQL credentials
set /p MYSQL_PASSWORD="Enter MySQL root password: "

echo.
echo Creating database...
mysql -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS assets_db;"
if %errorlevel% neq 0 (
    echo X Could not connect to MySQL. Please check credentials.
    pause
    exit /b 1
)
echo + Database 'assets_db' ready

echo.

REM Get API keys
set /p GEMINI_KEY="Enter your Gemini API Key (or press Enter to skip): "
set /p STOCKDATA_KEY="Enter your StockData API Key (or press Enter to skip): "

echo.
echo Updating application.properties...

REM Update application.properties
powershell -Command "(Get-Content src\main\resources\application.properties) -replace 'spring.datasource.password=.*', 'spring.datasource.password=%MYSQL_PASSWORD%' | Set-Content src\main\resources\application.properties"

if not "%GEMINI_KEY%"=="" (
    powershell -Command "(Get-Content src\main\resources\application.properties) -replace 'gemini.api.key=.*', 'gemini.api.key=%GEMINI_KEY%' | Set-Content src\main\resources\application.properties"
    echo + Gemini API key updated
)

if not "%STOCKDATA_KEY%"=="" (
    powershell -Command "(Get-Content src\main\resources\application.properties) -replace 'stockdata.api.key=.*', 'stockdata.api.key=%STOCKDATA_KEY%' | Set-Content src\main\resources\application.properties"
    echo + StockData API key updated
)

echo + MySQL password updated

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo To start the application, run:
echo   mvnw.cmd spring-boot:run
echo.
echo Then open your browser to:
echo   http://localhost:8080
echo.
echo Note: Get free API keys from:
echo   - Gemini: https://makersuite.google.com/app/apikey
echo   - StockData: https://www.stockdata.org/
echo.
pause
