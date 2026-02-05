# Portfolio Management System 📊

A full-stack web application for managing investment portfolios with real-time price tracking, AI-powered chatbot assistance, and comprehensive analytics.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.10-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 📈 **Real-time Portfolio Tracking** - Live stock and cryptocurrency prices
- 💰 **Profit/Loss Analysis** - Automatic P/L calculation with color-coded indicators
- 📊 **Interactive Visualizations** - Charts and graphs powered by Chart.js
- 🤖 **AI Chatbot** - Get investment advice using Google Gemini AI
- 📑 **Detailed Reports** - Weekly summaries and asset breakdowns
- 🌙 **Dark Theme UI** - Professional, easy-on-the-eyes interface
- 🔄 **Single Page Application** - Smooth, no-reload navigation

## 🚀 Quick Start

### Prerequisites
- Java 17+
- MySQL 8.0+
- Internet connection (for live prices)

### Installation (3 Easy Steps)

1. **Create Database**
```sql
CREATE DATABASE assets_db;
```

2. **Configure Application**

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
gemini.api.key=YOUR_GEMINI_API_KEY
stockdata.api.key=YOUR_STOCKDATA_API_KEY
```

Get free API keys:
- Gemini: https://makersuite.google.com/app/apikey
- StockData: https://www.stockdata.org/

3. **Run Application**
```bash
./mvnw spring-boot:run
```

Open browser: **http://localhost:8080**

### Automated Setup (Optional)

**Linux/Mac:**
```bash
./setup.sh
```

**Windows:**
```bash
setup.bat
```

## 📖 Documentation

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 🎯 Usage

### Adding Assets
1. Navigate to "Manage Assets"
2. Fill in the Quick Entry form
3. Click "Add Asset"

**Stock Example:**
- Symbol: `AAPL`
- Type: Stock

**Crypto Example:**
- Symbol: `bitcoin` (lowercase!)
- Type: Crypto

### Using the Chatbot
Ask questions like:
- "What's my total portfolio value?"
- "Show me my best performing asset"
- "Should I buy more AAPL?"

## 🛠️ Tech Stack

### Backend
- Spring Boot 3.5.10
- Spring Data JPA
- MySQL 8.0
- Lombok
- Google API Client

### Frontend
- HTML5 / CSS3
- Vanilla JavaScript (ES6+)
- Chart.js
- Fetch API

### External APIs
- Google Gemini (AI Chatbot)
- StockData.org (Stock Prices)
- CoinGecko (Crypto Prices)

## 📁 Project Structure

```
src/
├── main/
│   ├── java/Api_Assets/
│   │   ├── controller/      # REST endpoints
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access
│   │   ├── entity/          # Data models
│   │   └── dto/             # Transfer objects
│   └── resources/
│       ├── static/          # Frontend files
│       └── application.properties
└── test/                    # Unit tests
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | Get all assets |
| GET | `/api/assets/dashboard` | Get dashboard data |
| POST | `/api/assets` | Add new asset |
| POST | `/api/assets/sell/{id}` | Sell asset |
| POST | `/api/chat` | AI chatbot |
| GET | `/api/report/weekly` | Weekly report |

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check MySQL is running
sudo systemctl status mysql   # Linux
brew services list            # Mac
```

### Port 8080 Already in Use
Change port in `application.properties`:
```properties
server.port=8081
```

### API Key Issues
- Verify keys are correct
- Check API quota limits
- Ensure internet connection

## 🔒 Security

**Important:** Never commit API keys to version control!

Use environment variables for production:
```bash
export GEMINI_API_KEY=your_key
export STOCKDATA_API_KEY=your_key
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please check [SETUP_GUIDE.md](SETUP_GUIDE.md) or open an issue.

---

**Made with ❤️ using Spring Boot and Vanilla JavaScript**
