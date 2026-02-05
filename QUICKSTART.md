# 🚀 QUICK START - Portfolio Management System

## ⚡ Get Running in 5 Minutes!

### Step 1: Install Prerequisites (5 mins)

**Java 17+**
- Windows/Mac: Download from https://adoptium.net/
- Linux: `sudo apt install openjdk-17-jdk`
- Verify: `java -version`

**MySQL 8.0+**
- Windows/Mac: Download from https://dev.mysql.com/downloads/
- Linux: `sudo apt install mysql-server`
- Start MySQL and set root password

### Step 2: Setup Database (1 min)

```sql
mysql -u root -p
CREATE DATABASE assets_db;
EXIT;
```

### Step 3: Configure (2 mins)

Edit `src/main/resources/application.properties`:

```properties
# Line 4: Set your MySQL password
spring.datasource.password=your_mysql_password

# Line 13: Get free key from https://makersuite.google.com/app/apikey
gemini.api.key=your_gemini_key

# Line 16: Get free key from https://www.stockdata.org/
stockdata.api.key=your_stockdata_key
```

### Step 4: Run (1 min)

```bash
# Linux/Mac
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

### Step 5: Open Browser

Go to: **http://localhost:8080**

---

## 🎉 You're Done!

### First Steps:
1. Click "Manage Assets"
2. Add a stock (AAPL, GOOGL, MSFT)
3. Add crypto (bitcoin, ethereum - lowercase!)
4. Check Dashboard to see your portfolio

### Try the Chatbot:
- "What's my portfolio worth?"
- "Show me my best asset"
- "Should I buy AAPL?"

---

## ⚠️ Common Issues

**Port 8080 in use?**
Change in application.properties: `server.port=8081`

**Database connection error?**
Check MySQL is running and password is correct

**Crypto prices not working?**
Use lowercase: `bitcoin` not `BITCOIN`

**Stock prices not working?**
Verify your StockData API key

---

## 📚 Full Documentation

For detailed setup: See **SETUP_GUIDE.md**

For API reference: See **README.md**

---

**Need Help?** Check the logs in terminal for error messages!
