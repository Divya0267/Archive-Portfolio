
let currentPage = 'dashboard';
let dashboardData = [];
let holdingsFilter = 'all';
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupEventListeners();
    loadPage('dashboard');
});

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            loadPage(page);
        });
    });
}

function loadPage(pageName) {

    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const page = document.getElementById(`${pageName}-page`);
    if (page) {
        page.classList.add('active');
        currentPage = pageName;

        switch(pageName) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'manage':
                loadManageAssets();
                break;
            case 'holdings':
                loadHoldings();
                break;
            case 'visualizations':
                loadVisualizations();
                break;
            case 'reports':
                loadReports();
                break;
        }
    }
}

// ==================== DASHBOARD ====================
async function loadDashboard() {
    try {
        dashboardData = await API.getDashboard();
        
        // Calculate totals
        let totalPortfolio = 0;
        let totalInvested = 0;
        let totalCrypto = 0;
        let totalStock = 0;

        dashboardData.forEach(asset => {
            const currentValue = asset.currentPrice * asset.qty;
            const investedValue = asset.buyPrice * asset.qty;
            
            totalPortfolio += currentValue;
            totalInvested += investedValue;

            if (asset.assetType === 'CRYPTO') {
                totalCrypto += currentValue;
            } else {
                totalStock += currentValue;
            }
        });

        // Update stat cards
        document.getElementById('total-portfolio').textContent = Utils.formatCurrency(totalPortfolio);
        document.getElementById('total-invested').textContent = Utils.formatCurrency(totalInvested);
        document.getElementById('total-crypto').textContent = Utils.formatCurrency(totalCrypto);
        document.getElementById('total-stock').textContent = Utils.formatCurrency(totalStock);

        // Create charts
        createAllocationChart(totalStock, totalCrypto);
        createGrowthChart(dashboardData);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function createAllocationChart(stockValue, cryptoValue) {
    const ctx = document.getElementById('allocation-chart');
    
    // Destroy existing chart
    if (charts.allocation) {
        charts.allocation.destroy();
    }

    charts.allocation = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Stocks', 'Crypto'],
            datasets: [{
                data: [stockValue, cryptoValue],
                backgroundColor: ['#3b82f6', '#22c55e'],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e5e7eb',
                        padding: 15,
                    }
                }
            }
        }
    });
}

function createGrowthChart(data) {
    const ctx = document.getElementById('growth-chart');
    
    // Destroy existing chart
    if (charts.growth) {
        charts.growth.destroy();
    }

    // Prepare data
    const labels = data.map(asset => asset.symbol);
    const profits = data.map(asset => {
        const pl = (asset.currentPrice - asset.buyPrice) * asset.qty;
        return pl;
    });

    const colors = profits.map(p => p >= 0 ? '#22c55e' : '#ef4444');

    charts.growth = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'P/L ($)',
                data: profits,
                backgroundColor: colors,
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#1f1f1f',
                    },
                    ticks: {
                        color: '#9ca3af',
                    }
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#9ca3af',
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            }
        }
    });
}

// ==================== MANAGE ASSETS ====================
function setupEventListeners() {
    // Add asset form
    const form = document.getElementById('add-asset-form');
    if (form) {
        form.addEventListener('submit', handleAddAsset);
    }

    // Chat
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    }
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    // Holdings filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            holdingsFilter = btn.dataset.filter;
            loadHoldings();
        });
    });

    // Modal close
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

async function handleAddAsset(e) {
    e.preventDefault();
    
    const asset = {
        symbol: document.getElementById('symbol').value.toUpperCase(),
        name: document.getElementById('name').value,
        assetType: document.getElementById('assetType').value,
        buyPrice: parseFloat(document.getElementById('buyPrice').value),
        qty: parseInt(document.getElementById('qty').value),
    };

    try {
        await API.addAsset(asset);
        e.target.reset();
        loadManageAssets();
        alert('Asset added successfully!');
    } catch (error) {
        console.error('Error adding asset:', error);
        alert('Failed to add asset. Please try again.');
    }
}

async function loadManageAssets() {
    try {
        const data = await API.getDashboard();
        const tbody = document.getElementById('manage-tbody');
        tbody.innerHTML = '';

        data.forEach(asset => {
            const pl = (asset.currentPrice - asset.buyPrice) * asset.qty;
            const plClass = pl >= 0 ? 'profit' : 'loss';
            const plSign = pl >= 0 ? '+' : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asset.symbol}</td>
                <td>${asset.name}</td>
                <td>${asset.assetType}</td>
                <td>${Utils.formatCurrency(asset.buyPrice)}</td>
                <td>${asset.qty}</td>
                <td>${Utils.formatCurrency(asset.currentPrice)}</td>
                <td>${Utils.formatCurrency(asset.currentPrice * asset.qty)}</td>
                <td class="${plClass}">${plSign}${Utils.formatCurrency(Math.abs(pl))}</td>
                <td><button class="btn-sell" onclick="handleSellAsset(${asset.id})">Sell</button></td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading manage assets:', error);
    }
}

async function handleSellAsset(id) {
    if (!confirm('Are you sure you want to sell this asset?')) {
        return;
    }

    try {
        const message = await API.sellAssetById(id);
        alert(message);
        loadManageAssets();
    } catch (error) {
        console.error('Error selling asset:', error);
        alert('Failed to sell asset. Please try again.');
    }
}

// Make handleSellAsset global
window.handleSellAsset = handleSellAsset;

// ==================== HOLDINGS ====================
async function loadHoldings() {
    try {
        let data;
        if (holdingsFilter === 'all') {
            data = await API.getDashboard();
        } else if (holdingsFilter === 'STOCK') {
            data = await API.getStocks();
            // Need to fetch current prices for stocks
            const dashboard = await API.getDashboard();
            data = data.map(asset => {
                const dashAsset = dashboard.find(d => d.id === asset.id);
                return dashAsset || asset;
            });
        } else if (holdingsFilter === 'CRYPTO') {
            data = await API.getCrypto();
            // Need to fetch current prices for crypto
            const dashboard = await API.getDashboard();
            data = data.map(asset => {
                const dashAsset = dashboard.find(d => d.id === asset.id);
                return dashAsset || asset;
            });
        }

        const tbody = document.getElementById('holdings-tbody');
        tbody.innerHTML = '';

        data.forEach(asset => {
            const pl = (asset.currentPrice - asset.buyPrice) * asset.qty;
            const plPercent = ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
            const plClass = pl >= 0 ? 'profit' : 'loss';
            const plSign = pl >= 0 ? '+' : '';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asset.symbol}</td>
                <td>${asset.name}</td>
                <td>${asset.assetType}</td>
                <td>${asset.qty}</td>
                <td>${Utils.formatCurrency(asset.currentPrice)}</td>
                <td>${Utils.formatCurrency(asset.currentPrice * asset.qty)}</td>
                <td class="${plClass}">${plSign}${Utils.formatCurrency(Math.abs(pl))} (${Utils.formatPercent(plPercent)})</td>
            `;
            row.addEventListener('click', () => showAssetDetail(asset));
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading holdings:', error);
    }
}

function showAssetDetail(asset) {
    const modal = document.getElementById('detail-modal');
    const pl = (asset.currentPrice - asset.buyPrice) * asset.qty;
    const plClass = pl >= 0 ? 'profit' : 'loss';
    const plSign = pl >= 0 ? '+' : '';

    document.getElementById('detail-symbol').textContent = asset.symbol;
    document.getElementById('detail-name').textContent = asset.name;
    document.getElementById('detail-buy-price').textContent = Utils.formatCurrency(asset.buyPrice);
    document.getElementById('detail-qty').textContent = asset.qty;
    document.getElementById('detail-current-price').textContent = Utils.formatCurrency(asset.currentPrice);
    document.getElementById('detail-value').textContent = Utils.formatCurrency(asset.currentPrice * asset.qty);
    
    const plElement = document.getElementById('detail-pl');
    plElement.textContent = `${plSign}${Utils.formatCurrency(Math.abs(pl))}`;
    plElement.className = `detail-value ${plClass}`;

    modal.style.display = 'block';
}

// ==================== VISUALIZATIONS ====================
async function loadVisualizations() {
    try {
        const data = await API.getDashboard();
        
        // Calculate totals by type
        let stockTotal = 0;
        let cryptoTotal = 0;

        data.forEach(asset => {
            const value = asset.currentPrice * asset.qty;
            if (asset.assetType === 'STOCK') {
                stockTotal += value;
            } else {
                cryptoTotal += value;
            }
        });

        createVizPieChart(stockTotal, cryptoTotal);
        createVizLineChart(data);
    } catch (error) {
        console.error('Error loading visualizations:', error);
    }
}

function createVizPieChart(stockValue, cryptoValue) {
    const ctx = document.getElementById('viz-pie-chart');
    
    if (charts.vizPie) {
        charts.vizPie.destroy();
    }

    charts.vizPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Stocks', 'Crypto'],
            datasets: [{
                data: [stockValue, cryptoValue],
                backgroundColor: ['#3b82f6', '#22c55e'],
                borderWidth: 2,
                borderColor: '#0f0f0f',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e5e7eb',
                        padding: 20,
                        font: {
                            size: 14,
                        }
                    }
                }
            }
        }
    });
}

function createVizLineChart(data) {
    const ctx = document.getElementById('viz-line-chart');
    
    if (charts.vizLine) {
        charts.vizLine.destroy();
    }

    // Prepare data - show performance as percentage change
    const labels = data.map(asset => asset.symbol);
    const performance = data.map(asset => {
        return ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100;
    });

    charts.vizLine = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance (%)',
                data: performance,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#0f0f0f',
                pointBorderWidth: 2,
                pointRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: {
                        color: '#1f1f1f',
                    },
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#9ca3af',
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e5e7eb',
                    }
                }
            }
        }
    });
}

// ==================== CHATBOT ====================
async function handleSendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    addChatMessage(message, 'user');
    input.value = '';

    // Show loading
    const loading = document.getElementById('chat-loading');
    const chatHistory = document.getElementById('chat-history');
    chatHistory.appendChild(loading);
    loading.style.display = 'block';
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await ChatAPI.sendMessage(message);
        
        // Remove loading
        loading.style.display = 'none';
        
        // Add bot response
        addChatMessage(response.reply || response.message, 'bot');
    } catch (error) {
        console.error('Error sending message:', error);
        loading.style.display = 'none';
        addChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

function addChatMessage(text, sender) {
    const chatHistory = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// ==================== REPORTS ====================
async function loadReports() {
    try {
        const data = await API.getDashboard();
        
        // Calculate summary
        let totalAssets = data.length;
        let totalPortfolioValue = 0;
        let totalPL = 0;

        data.forEach(asset => {
            const value = asset.currentPrice * asset.qty;
            const pl = (asset.currentPrice - asset.buyPrice) / asset.buyPrice * 100;
            totalPortfolioValue += value;
            totalPL += pl;
        });

        const avgPL = totalAssets > 0 ? totalPL / totalAssets : 0;

        // Update summary
        document.getElementById('report-total-assets').textContent = totalAssets;
        document.getElementById('report-portfolio-value').textContent = Utils.formatCurrency(totalPortfolioValue);
        
        const avgPlElement = document.getElementById('report-avg-pl');
        avgPlElement.textContent = Utils.formatPercent(avgPL);
        avgPlElement.className = `report-value ${avgPL >= 0 ? 'profit' : 'loss'}`;

        // Populate asset table
        const tbody = document.getElementById('report-assets-tbody');
        tbody.innerHTML = '';

        data.forEach(asset => {
            const value = asset.currentPrice * asset.qty;
            const pl = (asset.currentPrice - asset.buyPrice) / asset.buyPrice * 100;
            const plClass = pl >= 0 ? 'profit' : 'loss';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asset.symbol}</td>
                <td>${asset.assetType}</td>
                <td>${Utils.formatCurrency(value)}</td>
                <td class="${plClass}">${Utils.formatPercent(pl)}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}
