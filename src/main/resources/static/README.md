# Portfolio Management Dashboard - Frontend

A production-ready, dark-themed portfolio management dashboard built with vanilla HTML, CSS, and JavaScript. Fully integrated with Spring Boot backend.

## 📁 Files Included

- `index.html` - Main HTML structure with all 6 pages
- `styles.css` - Complete dark theme styling
- `api.js` - Backend API integration layer
- `app.js` - SPA routing and application logic

## 🚀 Quick Start

### Option 1: Spring Boot Integration (Recommended)

1. Copy all 4 files to your Spring Boot project:
   ```
   src/main/resources/static/
   ```

2. Start your Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

3. Open browser:
   ```
   http://localhost:8080
   ```

### Option 2: Standalone Development

1. Update API base URL in `api.js`:
   ```javascript
   const API_BASE = 'http://localhost:8080/api';
   ```

2. Serve files using any local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Open browser to your local server

## 🔌 Backend Requirements

Your Spring Boot backend must have these endpoints running:

### Asset Endpoints
- `GET /api/assets/dashboard` - Dashboard data with live prices
- `GET /api/assets` - All assets
- `GET /api/assets/stocks` - Stock assets only
- `GET /api/assets/crypto` - Crypto assets only
- `POST /api/assets` - Add new asset
- `POST /api/assets/sell/{id}` - Sell asset by ID

### Chat Endpoint
- `POST /api/chat` - Send chat message
  - Request: `{ "message": "your message" }`
  - Response: `{ "reply": "bot response" }`

### Report Endpoint
- `GET /api/report/weekly` - Get weekly report

## ✨ Features

### 📊 Dashboard
- Total portfolio value
- Total invested value
- Asset allocation doughnut chart
- Growth analysis bar chart
- Crypto vs Stock breakdown

### ➕ Manage Assets
- Quick entry form (Symbol, Name, Type, Price, Quantity)
- Scrollable table with all assets
- P/L calculation with color coding
- Sell button for each asset

### 💼 Holdings
- Filterable view (All / Stocks / Cryptos)
- Clickable rows
- Detail modal with full asset information

### 📈 Visualizations
- Asset allocation pie chart (40% width)
- Performance line chart (60% width)

### 🤖 AI Chatbot
- Terminal-style interface
- Real-time responses from backend
- Loading indicators
- Scrollable chat history

### 📄 Reports
- Weekly asset summary
- Total asset count
- Portfolio value
- Average P/L
- Asset breakdown table

## 🎨 Design Features

- **Dark Theme** - Professional color palette
- **Zero-scroll UI** - Entire app fits in viewport
- **SPA** - No page reloads, smooth transitions
- **Responsive Charts** - Chart.js integration
- **Clean Tables** - Scrollable with sticky headers

## 🎨 Color Palette

- Background: `#050505`
- Cards: `#0f0f0f`
- Borders: `#1f1f1f`
- Primary Blue: `#3b82f6`
- Profit Green: `#22c55e`
- Loss Red: `#ef4444`
- Text: `#e5e7eb`

## 📝 Configuration

### Change API URL

Edit `api.js`:
```javascript
const API_BASE = 'http://your-backend-url:port/api';
```

### CORS Configuration

If running frontend separately, ensure your Spring Boot backend has CORS enabled:

```java
@CrossOrigin(origins = "*")
```

## 🛠️ Technologies Used

- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Chart.js for visualizations
- Fetch API for backend integration

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🐛 Troubleshooting

**Charts not showing?**
- Check that Chart.js CDN is loading
- Verify data is being fetched from backend

**API errors?**
- Confirm backend is running on correct port
- Check API_BASE URL in api.js
- Verify CORS is configured

**Blank page?**
- Open browser console (F12)
- Check for JavaScript errors
- Verify all 4 files are in same directory

## 📄 License

This project is built for the Portfolio Management System.

---

**Need help?** Check the browser console for errors or verify your backend endpoints are responding correctly.
