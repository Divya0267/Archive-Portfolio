# Portfolio Management System - Complete Setup Guide

## 📦 Project Overview

A full-stack Portfolio Management Dashboard with:
- **Backend**: Spring Boot 3.5.10 + MySQL + REST APIs
- **Frontend**: Vanilla HTML/CSS/JavaScript with Chart.js
- **Features**: Asset tracking, P/L calculation, AI chatbot, reports, visualizations

---

## 🚀 Quick Start (3 Steps)

### 1. Setup MySQL Database

```sql
-- Open MySQL and create database
CREATE DATABASE assets_db;
```

### 2. Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Update these values for your MySQL setup
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# Your API keys (get free keys from links below)
gemini.api.key=YOUR_GEMINI_API_KEY
stockdata.api.key=YOUR_STOCKDATA_API_KEY
```

### 3. Run Application

```bash
# Using Maven Wrapper (recommended)
./mvnw spring-boot:run

# Or using installed Maven
mvn spring-boot:run
```

Access the application at: **http://localhost:8080**

---

## 📋 Prerequisites

### Required Software
- **Java 17+** - [Download](https://adoptium.net/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Maven 3.6+** - (included via Maven Wrapper)

### Required API Keys (Free)

1. **Gemini API Key** (for AI Chatbot)
   - Visit: https://makersuite.google.com/app/apikey
   - Create free API key
   - Add to `application.properties`

2. **StockData API Key** (for Stock Prices)
   - Visit: https://www.stockdata.org/
   - Sign up for free tier
   - Add to `application.properties`

---

## 🔧 Detailed Installation

### Step 1: Install Java 17

**Windows:**
```bash
# Download from https://adoptium.net/
# Run installer and verify:
java -version
```

**Mac:**
```bash
brew install openjdk@17
java -version
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
java -version
```

### Step 2: Install MySQL

**Windows:**
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run installer, select "Developer Default"
3. Set root password during setup

**Mac:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Step 3: Create Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE assets_db;

-- Verify
SHOW DATABASES;

-- Exit
EXIT;
```

### Step 4: Configure Application

1. Open `src/main/resources/application.properties`
2. Update database credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Add your API keys (see API Keys section below)

### Step 5: Run Application

```bash
# Make Maven wrapper executable (Linux/Mac)
chmod +x mvnw

# Run the application
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

Wait for: `Started ApiAssetsApplication in X seconds`

### Step 6: Access Application

Open browser: **http://localhost:8080**

---

## 🔑 API Keys Setup

### Gemini API (AI Chatbot)

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Add to `application.properties`:
   ```properties
   gemini.api.key=YOUR_KEY_HERE
   ```

### StockData API (Stock Prices)

1. Go to: https://www.stockdata.org/
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Copy your API key
5. Add to `application.properties`:
   ```properties
   stockdata.api.key=YOUR_KEY_HERE
   ```

**Note:** Crypto prices are fetched from CoinGecko (no API key required)

---

## 📁 Project Structure

```
portfolio-management/
├── src/
│   ├── main/
│   │   ├── java/Api_Assets/
│   │   │   ├── controller/          # REST API endpoints
│   │   │   │   ├── UserAssetController.java
│   │   │   │   ├── ChatController.java
│   │   │   │   └── ReportController.java
│   │   │   ├── service/             # Business logic
│   │   │   │   ├── UserAssetService.java
│   │   │   │   ├── StockService.java
│   │   │   │   ├── CryptoService.java
│   │   │   │   ├── ChatService.java
│   │   │   │   └── GeminiService.java
│   │   │   ├── repository/          # Database access
│   │   │   │   └── UserAssetRepository.java
│   │   │   ├── entity/              # Data models
│   │   │   │   └── UserAsset.java
│   │   │   └── dto/                 # Data transfer objects
│   │   └── resources/
│   │       ├── static/              # Frontend files
│   │       │   ├── index.html
│   │       │   ├── styles.css
│   │       │   ├── app.js
│   │       │   └── api.js
│   │       └── application.properties
│   └── test/                        # Unit tests
├── pom.xml                          # Maven dependencies
└── README.md                        # This file
```

---

## 🌐 API Endpoints

### Asset Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | Get all assets |
| GET | `/api/assets/dashboard` | Get dashboard with live prices |
| GET | `/api/assets/stocks` | Get stock assets only |
| GET | `/api/assets/crypto` | Get crypto assets only |
| POST | `/api/assets` | Add new asset |
| POST | `/api/assets/sell/{id}` | Sell asset by ID |
| POST | `/api/assets/sell` | Sell asset by symbol/quantity |
| GET | `/api/assets/profit-loss` | Get P/L report |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI chatbot |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/report/weekly` | Get weekly asset report |

---

## 📊 Features Guide

### Dashboard
- **Total Portfolio Value**: Sum of all current holdings
- **Total Invested**: Original investment amount
- **Asset Allocation**: Pie chart of stocks vs crypto
- **Growth Chart**: Bar chart showing P/L per asset
- **Category Totals**: Separate totals for stocks and crypto

### Manage Assets
- **Quick Entry Form**: Add new assets with symbol, name, type, price, quantity
- **Asset Table**: View all assets with real-time prices
- **P/L Display**: Color-coded profit (green) and loss (red)
- **Sell Button**: Quick sell functionality for each asset

### Holdings
- **Filter Options**: View All / Stocks Only / Crypto Only
- **Clickable Rows**: Click any row to see detailed information
- **Detail Modal**: Complete asset information including:
  - Buy price and current price
  - Total value and P/L
  - Quantity held

### Visualizations
- **Asset Allocation Pie**: Visual breakdown of portfolio
- **Performance Line**: Track performance trends

### AI Chatbot
- Ask questions about your portfolio
- Get investment advice
- Query specific assets
- Powered by Google Gemini AI

### Reports
- Weekly summary of all assets
- Total count and portfolio value
- Average P/L across portfolio
- Detailed asset breakdown table

---

## 🛠️ Troubleshooting

### Database Connection Issues

**Error:** `Access denied for user 'root'@'localhost'`
```bash
# Reset MySQL password
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;
```

**Error:** `Unknown database 'assets_db'`
```sql
CREATE DATABASE assets_db;
```

### Port Already in Use

**Error:** `Port 8080 is already in use`

Change port in `application.properties`:
```properties
server.port=8081
```

Then access: http://localhost:8081

### API Key Issues

**Chatbot not working:**
- Verify Gemini API key is correct
- Check API key has not expired
- Ensure you have quota remaining

**Stock prices not updating:**
- Verify StockData API key
- Check free tier limits not exceeded
- Try different stock symbols

### Frontend Not Loading

1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console for errors (F12)
3. Verify files exist in `src/main/resources/static/`
4. Restart Spring Boot application

### Maven Build Errors

```bash
# Clean and rebuild
./mvnw clean install

# Skip tests if needed
./mvnw clean install -DskipTests
```

---

## 🎨 Customization

### Change Colors

Edit `src/main/resources/static/styles.css`:

```css
/* Background colors */
body { background: #050505; }
.card { background: #0f0f0f; }

/* Accent colors */
.btn-primary { background: #3b82f6; }
.profit { color: #22c55e; }
.loss { color: #ef4444; }
```

### Add New Asset Types

1. Update database enum in `UserAsset.java`
2. Add filter option in `holdings-page`
3. Update allocation charts in `app.js`

### Change Default Port

Edit `application.properties`:
```properties
server.port=9090
```

---

## 📈 Usage Examples

### Adding a Stock
1. Go to "Manage Assets"
2. Fill in form:
   - Symbol: AAPL
   - Name: Apple Inc.
   - Type: Stock
   - Buy Price: 150.00
   - Quantity: 10
3. Click "Add Asset"

### Adding Crypto
1. Go to "Manage Assets"
2. Fill in form:
   - Symbol: bitcoin (lowercase!)
   - Name: Bitcoin
   - Type: Crypto
   - Buy Price: 45000.00
   - Quantity: 0.5
3. Click "Add Asset"

**Important:** Use lowercase for crypto symbols (bitcoin, ethereum, etc.)

### Chatbot Examples
- "What's my total portfolio value?"
- "Show me my best performing asset"
- "Should I buy more AAPL?"
- "What's the current price of Bitcoin?"

---

## 🔒 Security Notes

### Production Deployment

**DO NOT** commit `application.properties` with real API keys!

Use environment variables:
```properties
gemini.api.key=${GEMINI_API_KEY}
stockdata.api.key=${STOCKDATA_API_KEY}
spring.datasource.password=${DB_PASSWORD}
```

Set environment variables:
```bash
export GEMINI_API_KEY=your_key
export STOCKDATA_API_KEY=your_key
export DB_PASSWORD=your_password
```

### Database Security
- Use strong passwords
- Don't use 'root' in production
- Create dedicated database user:
```sql
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON assets_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📝 Development

### Adding New Features

1. Create new endpoint in controller
2. Implement service logic
3. Add frontend integration in `api.js`
4. Update UI in `app.js`

### Running Tests

```bash
./mvnw test
```

### Hot Reload

Spring Boot DevTools is included - changes auto-reload!

---

## 🐛 Known Issues

1. **Crypto prices**: Use lowercase symbols (bitcoin, not BITCOIN)
2. **Stock symbols**: Must be valid US stock symbols
3. **API rate limits**: Free tiers have request limits
4. **Browser compatibility**: Best on Chrome/Firefox

---

## 📞 Support

### Common Questions

**Q: Can I use PostgreSQL instead of MySQL?**
A: Yes! Update `pom.xml` dependency and `application.properties` URL

**Q: How do I deploy to production?**
A: Build JAR: `./mvnw clean package`
   Run: `java -jar target/Api_Assets-0.0.1-SNAPSHOT.jar`

**Q: Can I add more crypto exchanges?**
A: Yes! Modify `CryptoService.java` to call additional APIs

**Q: How to backup data?**
A: Use MySQL dump: `mysqldump -u root -p assets_db > backup.sql`

---

## 📄 License

This project is for educational/portfolio purposes.

---

## ✅ Checklist

Before running, ensure:

- [ ] Java 17+ installed
- [ ] MySQL running
- [ ] Database `assets_db` created
- [ ] `application.properties` configured
- [ ] API keys added
- [ ] Port 8080 available
- [ ] Internet connection (for live prices)

---

**Ready to go! Run `./mvnw spring-boot:run` and visit http://localhost:8080** 🚀
