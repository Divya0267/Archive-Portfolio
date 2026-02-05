// Centralized API helpers wired to Spring Boot backend.
//
// Assumes the backend is running at the same origin, e.g.:
//   http://localhost:8080
// with endpoints under /api/assets.
//
// If your backend runs on a different host/port, change API_BASE_URL accordingly.

const API_BASE_URL = ""; // same origin (e.g. http://localhost:8080)

/** Normalize backend type: DashboardAsset uses "type"; accept type/assetType and infer Crypto from symbol if needed. */
function normalizeAssetType(a) {
  const t = (a.type || a.assetType || "").toUpperCase();
  if (t === "STOCK" || t === "CRYPTO") return t;
  const sym = (a.symbol || "").toUpperCase();
  if (["BTC", "ETH", "SOL", "ADA", "XRP", "DOGE", "USDT", "USDC"].includes(sym)) return "CRYPTO";
  return t || "STOCK";
}

/* --------------------------------------------------
   Price Caching (5 minutes)
   -------------------------------------------------- */
const PRICE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const priceCache = {
  holdings: null,
  timestamp: null,
};

function isCacheValid() {
  if (!priceCache.holdings || !priceCache.timestamp) {
    return false;
  }
  const now = Date.now();
  return (now - priceCache.timestamp) < PRICE_CACHE_DURATION;
}

function setCachedHoldings(data) {
  priceCache.holdings = data;
  priceCache.timestamp = Date.now();
}

function getCachedHoldings() {
  if (isCacheValid()) {
    return priceCache.holdings;
  }
  return null;
}

function clearPriceCache() {
  priceCache.holdings = null;
  priceCache.timestamp = null;
}

/* --------------------------------------------------
   Low-level helper
   -------------------------------------------------- */

async function jsonFetch(path, options = {}) {
  const url = API_BASE_URL + path;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request to ${url} failed (${response.status}): ${text}`);
  }

  // Some Spring endpoints may return no content.
  if (response.status === 204) return null;

  return response.json();
}

/* --------------------------------------------------
   High-level API used by the frontend
   -------------------------------------------------- */

const API = {
  /* ------------------------
     Portfolio / Dashboard
     ------------------------ */

  /**
   * Dashboard / portfolio overview.
   *
   * Uses your existing holdings endpoint:
   *   GET /api/assets/holdings
   *
   * Backend response shape (DashboardAsset):
   * [
   *   {
   *     "id": 1,
   *     "type": "STOCK",
   *     "symbol": "AAPL",
   *     "name": "Apple Inc",
   *     "buyPrice": 210.00,
   *     "qty": 10,
   *     "currentPrice": 235.82,
   *     "currentDate": "2026-02-01T18:20:00",
   *     "differencePercent": 258.20,
   *     "percent": 12.29,
   *     "status": "PROFIT"
   *   },
   *   ...
   * ]
   *
   * Returns a normalized object that the UI expects:
   * {
   *   totalValue,
   *   totalPL,
   *   totalPLPercent,
   *   categories: { Stocks, Crypto },
   *   trends: [{ label, description }]
   * }
   */
  async getPortfolio() {
    // Check cache first
    const cached = getCachedHoldings();
    if (cached) {
      console.log("Using cached holdings data");
      var dashboardAssets = cached;
    } else {
      console.log("Fetching fresh holdings data from API");
      dashboardAssets = await jsonFetch("/api/assets/holdings");
      setCachedHoldings(dashboardAssets);
    }

    if (!Array.isArray(dashboardAssets)) {
      throw new Error("Unexpected /api/assets/holdings response shape");
    }

    let totalValue = 0;
    let totalCost = 0;

    const categories = {
      Stocks: 0,
      Crypto: 0,
    };

    dashboardAssets.forEach((a) => {
      const qty = Number(a.qty ?? 0);
      const buyPrice = Number(a.buyPrice ?? 0);
      const currentPrice = Number(a.currentPrice ?? 0);
      const value = currentPrice * qty;
      const cost = buyPrice * qty;

      totalValue += value;
      totalCost += cost;

      // Map assetType/type to frontend categories (backend sends "type": "STOCK" | "CRYPTO")
      const type = normalizeAssetType(a);
      if (type === "STOCK") {
        categories.Stocks += value;
      } else if (type === "CRYPTO") {
        categories.Crypto += value;
      }
    });

    const totalPL = totalValue - totalCost;
    const totalPLPercent = totalCost ? (totalPL / totalCost) * 100 : 0;

    // Simple trend placeholders; you can enhance using dates in dashboardAssets
    const trendLabel = totalPL > 0 ? "Uptrend" : totalPL < 0 ? "Downtrend" : "Flat";

    const trends = [
      {
        label: "Overall",
        description: `${trendLabel} (${totalPLPercent.toFixed(2)}% total return)`,
      },
    ];

    return {
      totalValue,
      totalPL,
      totalPLPercent,
      categories,
      trends,
    };
  },

  /* ------------------------
     Holdings
     ------------------------ */

  /**
   * Holdings table data.
   *
   * Uses your endpoint:
   *   GET /api/assets/holdings
   *
   * Backend response shape (DashboardAsset) is the same as getPortfolio().
   *
   * Returns:
   * [
   *   {
   *     id,
   *     symbol,
   *     name,
   *     category,      // "Stocks" / "Crypto"
   *     assetType,     // raw type from backend (e.g. "STOCK")
   *     buyPrice,
   *     quantity,
   *     currentPrice
   *   },
   *   ...
   * ]
   */
  async getHoldings() {
    // Check cache first
    const cached = getCachedHoldings();
    let assets;
    if (cached) {
      console.log("Using cached holdings data");
      assets = cached;
    } else {
      console.log("Fetching fresh holdings data from API");
      assets = await jsonFetch("/api/assets/holdings");
      setCachedHoldings(assets);
    }

    if (!Array.isArray(assets)) {
      throw new Error("Unexpected /api/assets/holdings response shape");
    }

    return assets.map((a) => {
      const type = normalizeAssetType(a);
      let category = "Other";
      if (type === "STOCK") category = "Stocks";
      else if (type === "CRYPTO") category = "Crypto";

      return {
        id: a.id,
        symbol: a.symbol,
        name: a.name,
        category,
        assetType: type,
        buyPrice: Number(a.buyPrice ?? 0),
        quantity: Number(a.qty ?? 0),
        currentPrice: Number(a.currentPrice ?? 0),
      };
    });
  },

  /**
   * Sold assets / history data.
   *
   * Uses your endpoint:
   *   GET /api/assets/history
   *
   * Backend response shape (UserAsset):
   * [
   *   {
   *     "id": 1,
   *     "assetType": "STOCK",
   *     "symbol": "AAPL",
   *     "name": "Apple Inc",
   *     "buyPrice": 210.00,
   *     "qty": 0,
   *     "currentPrice": 235.82,
   *     "sellingPrice": 235.82,
   *     "sellingDate": "2026-02-01T18:20:00"
   *   },
   *   ...
   * ]
   *
   * Returns:
   * [
   *   {
   *     id,
   *     symbol,
   *     name,
   *     assetType,
   *     buyPrice,
   *     quantity,      // quantity that was sold (from DB qty field)
   *     sellPrice,
   *     soldAt,        // Date instance (or null)
   *   },
   *   ...
   * ]
   */
  async getHistory() {
    const assets = await jsonFetch("/api/assets/history");

    if (!Array.isArray(assets)) {
      throw new Error("Unexpected /api/assets/history response shape");
    }

    return assets.map((a) => ({
      id: a.id,
      symbol: a.symbol,
      name: a.name,
      assetType: (a.assetType || "").toUpperCase(),
      buyPrice: Number(a.buyPrice ?? 0),
      quantity: Number(a.qty ?? 0),
      sellPrice: Number(a.sellingPrice ?? 0),
      soldAt: a.sellingDate ? new Date(a.sellingDate) : null,
    }));
  },

  /* ------------------------
     Manage assets helpers
     ------------------------ */

  /**
   * Add a new asset.
   *
   * Uses your endpoint:
   *   POST /api/assets
   *
   * Body example (from README):
   * {
   *   "assetType": "STOCK",
   *   "symbol": "AAPL",
   *   "name": "Apple Inc",
   *   "buyPrice": 210.0,
   *   "qty": 10
   * }
   *
   * NOTE: The current frontend "Manage Assets" page uses a purely
   * client-side list. To fully integrate, call this function
   * from `initManageAssets()` when the form is submitted.
   */
  async addAsset({ symbol, name, category, buyPrice, quantity }) {
    // Map UI category back to your assetType
    let assetType = "STOCK";
    if (category === "Crypto") assetType = "CRYPTO";

    const body = {
      assetType,
      symbol,
      name,
      buyPrice,
      qty: quantity,
    };

    const result = await jsonFetch("/api/assets", {
      method: "POST",
      body: JSON.stringify(body),
    });
    
    // Clear cache after adding asset to force refresh on next request
    clearPriceCache();
    
    return result;
  },
  
  /**
   * Clear the price cache (useful for manual refresh)
   */
  clearPriceCache() {
    priceCache.holdings = null;
    priceCache.timestamp = null;
  },

  /**
   * Sell an asset position.
   *
   * Uses your endpoint:
   *   POST /api/assets/sell
   *
   * Body:
   * {
   *   "symbol": "AAPL",
   *   "quantityToSell": 5
   * }
   *
   * The backend:
   * - looks up all rows by symbol,
   * - sells up to quantityToSell,
   * - updates live price and history.
   */
  async sellAsset(symbol, quantityToSell) {
    if (!symbol) throw new Error("sellAsset requires a symbol");
    if (!Number.isFinite(quantityToSell) || quantityToSell <= 0) {
      throw new Error("sellAsset requires a positive quantityToSell");
    }

    const result = await jsonFetch("/api/assets/sell", {
      method: "POST",
      body: JSON.stringify({ symbol, quantityToSell: Math.trunc(quantityToSell) }),
    });
    
    // Clear cache after selling to force refresh on next request
    clearPriceCache();
    
    return result;
  },

  /* ------------------------
     Recommendations (stub)
     ------------------------ */

  /**
   * Top 3 recommendations placeholder.
   *
   * IDEAL BACKEND ENDPOINT (to implement later):
   *   GET /api/recommendations/top3
   * Response shape:
   * [
   *   { "symbol": "QQQ", "name": "Invesco QQQ", "action": "Buy", "rationale": "..." },
   *   ...
   * ]
   *
   * For now, returns static data so the Report page works.
   */
  async getTopRecommendations() {
    // When you implement the backend, switch to:
    // return jsonFetch("/api/recommendations/top3");
    return [
      {
        symbol: "QQQ",
        name: "Invesco QQQ",
        action: "Buy",
        rationale: "Increases diversified exposure to large-cap US tech.",
      },
      {
        symbol: "BND",
        name: "Vanguard Total Bond",
        action: "Hold",
        rationale: "Provides fixed income ballast and reduces volatility.",
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        action: "Trim",
        rationale: "Lock in partial gains and limit downside risk.",
      },
    ];
  },

  /* ------------------------
     Chat
     ------------------------ */

  /**
   * AI Chat endpoint.
   *
   * Backend endpoint:
   *   POST /api/chat
   *   GET /api/chat?message=...
   * Body:    { "message": "..." }
   * Returns: { "reply": "..." }
   */
  async sendChatMessage(message) {
    try {
      const data = await jsonFetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      return data.reply || "";
    } catch (err) {
      console.error("Chat API error:", err);
      return (
        "Sorry, I encountered an error processing your message: \"" +
        message +
        "\". Please try again or check the backend connection."
      );
    }
  },

  /* ------------------------
     Reports
     ------------------------ */

  /**
   * Weekly report endpoint.
   * GET /api/report/weekly → String
   */
  async getWeeklyReport() {
    try {
      const response = await fetch("/api/report/weekly");
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      return await response.text();
    } catch (err) {
      console.error("Weekly report API error:", err);
      throw err;
    }
  },

  /**
   * Market news (stocks & crypto).
   * GET /api/report/news → string[]
   */
  async getMarketNews() {
    try {
      return await jsonFetch("/api/report/news");
    } catch (err) {
      console.error("Market news API error:", err);
      return [];
    }
  },
};