#!/bin/bash

echo "======================================"
echo "Portfolio Management System Setup"
echo "======================================"
echo ""

# Check Java
echo "Checking Java installation..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    echo "✓ Java $JAVA_VERSION found"
    if [ "$JAVA_VERSION" -lt 17 ]; then
        echo "⚠ Warning: Java 17+ required. You have Java $JAVA_VERSION"
        echo "Download from: https://adoptium.net/"
    fi
else
    echo "✗ Java not found"
    echo "Install Java 17+ from: https://adoptium.net/"
    exit 1
fi

echo ""

# Check MySQL
echo "Checking MySQL installation..."
if command -v mysql &> /dev/null; then
    echo "✓ MySQL found"
else
    echo "⚠ MySQL not found"
    echo "Install MySQL from: https://dev.mysql.com/downloads/"
fi

echo ""

# Check if database exists
echo "Checking database setup..."
read -p "Enter MySQL root password: " -s MYSQL_PASSWORD
echo ""

mysql -u root -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS assets_db;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database 'assets_db' ready"
else
    echo "✗ Could not connect to MySQL. Please check credentials."
    exit 1
fi

echo ""

# Update application.properties
echo "Updating application.properties..."
read -p "Enter your Gemini API Key (or press Enter to skip): " GEMINI_KEY
read -p "Enter your StockData API Key (or press Enter to skip): " STOCKDATA_KEY

PROP_FILE="src/main/resources/application.properties"

if [ ! -z "$GEMINI_KEY" ]; then
    sed -i.bak "s/gemini.api.key=.*/gemini.api.key=$GEMINI_KEY/" "$PROP_FILE"
    echo "✓ Gemini API key updated"
fi

if [ ! -z "$STOCKDATA_KEY" ]; then
    sed -i.bak "s/stockdata.api.key=.*/stockdata.api.key=$STOCKDATA_KEY/" "$PROP_FILE"
    echo "✓ StockData API key updated"
fi

sed -i.bak "s/spring.datasource.password=.*/spring.datasource.password=$MYSQL_PASSWORD/" "$PROP_FILE"
echo "✓ MySQL password updated"

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "To start the application, run:"
echo "  ./mvnw spring-boot:run"
echo ""
echo "Then open your browser to:"
echo "  http://localhost:8080"
echo ""
echo "Note: Get free API keys from:"
echo "  - Gemini: https://makersuite.google.com/app/apikey"
echo "  - StockData: https://www.stockdata.org/"
echo ""
