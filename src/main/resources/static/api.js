const API_BASE = 'http://localhost:8080';

export const API = {
    getAllAssets: async () => {
        const res = await fetch(`${API_BASE}/assets`);
        return res.json();
    },

    getDashboard: async () => {
        const res = await fetch(`${API_BASE}/assets/dashboard`);
        return res.json();
    },

    addAsset: async (asset) => {
        const res = await fetch(`${API_BASE}/assets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asset),
        });
        return res.json();
    },

    sellAssetById: async (id) => {
        const res = await fetch(`${API_BASE}/assets/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Sell failed');
    },
};

export const ChatAPI = {
    sendMessage: async (message) => {
        const res = await fetch(`${API_BASE}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });
        return res.json();
    },
};

export const ReportAPI = {
    getWeeklyReport: async () => {
        const res = await fetch(`${API_BASE}/report/weekly`);
        return res.json();
    },
};
