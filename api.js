const API_BASE = 'http://localhost:8080/api';
const API = {
    getAllAssets: async () => {
        const response = await fetch(`${API_BASE}/assets`);
        if (!response.ok) throw new Error('Failed to fetch assets');
        return response.json();
    },

    getDashboard: async () => {
        const response = await fetch(`${API_BASE}/assets/dashboard`);
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        return response.json();
    },

    getStocks: async () => {
        const response = await fetch(`${API_BASE}/assets/stocks`);
        if (!response.ok) throw new Error('Failed to fetch stocks');
        return response.json();
    },

    getCrypto: async () => {
        const response = await fetch(`${API_BASE}/assets/crypto`);
        if (!response.ok) throw new Error('Failed to fetch crypto');
        return response.json();
    },

    addAsset: async (asset) => {
        const response = await fetch(`${API_BASE}/assets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(asset),
        });
        if (!response.ok) throw new Error('Failed to add asset');
        return response.json();
    },

    sellAssetById: async (id) => {
        const response = await fetch(`${API_BASE}/assets/sell/${id}`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to sell asset');
        return response.text();
    },

    sellAsset: async (symbol, quantity) => {
        const response = await fetch(`${API_BASE}/assets/sell`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbol: symbol,
                quantityToSell: quantity,
            }),
        });
        if (!response.ok) throw new Error('Failed to sell asset');
        return response.text();
    },

    getProfitLoss: async () => {
        const response = await fetch(`${API_BASE}/assets/profit-loss`);
        if (!response.ok) throw new Error('Failed to fetch profit/loss');
        return response.json();
    },
};

const ChatAPI = {
    sendMessage: async (message) => {
        const response = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    },
};

const ReportAPI = {
    getWeeklyReport: async () => {
        const response = await fetch(`${API_BASE}/report/weekly`);
        if (!response.ok) throw new Error('Failed to fetch report');
        return response.text();
    },
};

const Utils = {
    formatCurrency: (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    },

    formatPercent: (value) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    },

    calculatePL: (buyPrice, currentPrice, qty) => {
        const pl = (currentPrice - buyPrice) * qty;
        return pl;
    },

    calculatePLPercent: (buyPrice, currentPrice) => {
        if (buyPrice === 0) return 0;
        return ((currentPrice - buyPrice) / buyPrice) * 100;
    },
};
