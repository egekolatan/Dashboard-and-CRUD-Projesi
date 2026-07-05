// Giriş Doğrulama Kontrolü (Güvenlik Kapısı)
const loggedInUser = JSON.parse(localStorage.getItem('auth_crud_current_user'));
if (!loggedInUser) {
    // Giriş yapılmadıysa doğrudan giriş sayfasına yönlendir
    window.location.href = '../auth-crud/';
}

// Her kullanıcının verilerini izole etmek için benzersiz bir önek oluşturuyoruz
const userPrefix = loggedInUser ? loggedInUser.email + '_' : '';

// App State Managers & Storage Keys
const KEYS = {
    THEME: userPrefix + 'novadash_theme',
    ACCENT: userPrefix + 'novadash_accent',
    USERNAME: userPrefix + 'novadash_username',
    TASKS: userPrefix + 'novadash_tasks',
    TRANSACTIONS: userPrefix + 'novadash_transactions',
    NOTES: userPrefix + 'novadash_notes',
    QUICK_NOTE: userPrefix + 'novadash_quick_note',
    ACTIVE_NOTE_ID: userPrefix + 'novadash_active_note_id',
    AVATAR: userPrefix + 'novadash_avatar',
    NOTIFICATIONS: userPrefix + 'novadash_notifications',
    CITY: userPrefix + 'novadash_city',
    NOTE_BG: userPrefix + 'novadash_note_bg',
    NOTE_SIZE: userPrefix + 'novadash_note_size'
};Location = window.location;

// State Object
let state = {
    theme: localStorage.getItem(KEYS.THEME) || 'dark',
    accent: localStorage.getItem(KEYS.ACCENT) || '#3b82f6',
    username: localStorage.getItem(KEYS.USERNAME) || (loggedInUser ? loggedInUser.name : 'Ege Kolatan'),
    tasks: JSON.parse(localStorage.getItem(KEYS.TASKS)) || [],
    transactions: JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS)) || [],
    notes: JSON.parse(localStorage.getItem(KEYS.NOTES)) || [],
    quickNote: localStorage.getItem(KEYS.QUICK_NOTE) || '',
    activeNoteId: localStorage.getItem(KEYS.ACTIVE_NOTE_ID) || null,
    avatar: localStorage.getItem(KEYS.AVATAR) || (loggedInUser && loggedInUser.name ? loggedInUser.name.charAt(0).toUpperCase() : 'E'),
    notifications: JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || [],
    city: localStorage.getItem(KEYS.CITY) || 'İzmir',
    noteBg: localStorage.getItem(userPrefix + 'novadash_note_bg') || '',
    noteSize: localStorage.getItem(userPrefix + 'novadash_note_size') || '15px'
};


// Simulated Real-Time System Data
const systemHistory = {
    labels: Array(15).fill(''),
    cpu: Array(15).fill(0),
    ram: Array(15).fill(0)
};

// Chart instances
let performanceChartInstance = null;
let financePieChartInstance = null;

// Save helper
function saveState(key, value) {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
}

// ----------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAccentColor();
    initNavigation();
    initClock();
    initRealtimeSimulation();
    initTradingViewWidget();
    initOverviewPanel();
    initTasksPanel();
    initFinancePanel();
    initNotesPanel();
    initSettingsPanel();
    initWelcomeBanner();
    updateWeather();
    initPomodoro();
    initNotifications();
    initShortcuts();
});

// ----------------------------------------------------
// THEME & ACCENT MANAGEMENT
// ----------------------------------------------------
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    
    const darkBtn = document.getElementById('theme-dark-btn');
    const lightBtn = document.getElementById('theme-light-btn');
    
    if (state.theme === 'dark') {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
    } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
    }
    
    darkBtn.addEventListener('click', () => setTheme('dark'));
    lightBtn.addEventListener('click', () => setTheme('light'));
}

function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    saveState(KEYS.THEME, theme);
    
    const darkBtn = document.getElementById('theme-dark-btn');
    const lightBtn = document.getElementById('theme-light-btn');
    
    if (theme === 'dark') {
        darkBtn.classList.add('active');
        lightBtn.classList.remove('active');
    } else {
        lightBtn.classList.add('active');
        darkBtn.classList.remove('active');
    }
    
    // Re-initialize TradingView widget to match new theme
    initTradingViewWidget();
}

function initAccentColor() {
    setAccentColor(state.accent);
    
    // Highlight the active accent button in settings
    const accentBtns = document.querySelectorAll('.accent-btn');
    accentBtns.forEach(btn => {
        if (btn.dataset.color === state.accent) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            accentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setAccentColor(btn.dataset.color);
        });
    });
}

function setAccentColor(color) {
    state.accent = color;
    saveState(KEYS.ACCENT, color);
    document.documentElement.style.setProperty('--accent-color', color);
    
    // Convert hex to rgb for rgba usage in CSS
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
}

// ----------------------------------------------------
// NAVIGATION (TAB SWITCHING)
// ----------------------------------------------------
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const panels = document.querySelectorAll('.tab-panel');
    const pageTitle = document.getElementById('page-title-text');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.dataset.tab;
            
            navItems.forEach(nav => nav.classList.remove('active'));
            panels.forEach(panel => panel.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(`panel-${targetTab}`).classList.add('active');
            
            // Set Page Title
            pageTitle.textContent = item.querySelector('span').textContent;
            
            // Layout reflow for charts when switching tabs
            if (targetTab === 'overview' && performanceChartInstance) {
                performanceChartInstance.resize();
            } else if (targetTab === 'finance' && financePieChartInstance) {
                financePieChartInstance.resize();
            }
        });
    });
}

// ----------------------------------------------------
// CLOCK / TIME TRACKER
// ----------------------------------------------------
function initClock() {
    const hourEl = document.getElementById('clock-hour');
    const minuteEl = document.getElementById('clock-minute');
    const secondEl = document.getElementById('clock-second');
    const dateEl = document.getElementById('clock-date');
    const dayEl = document.getElementById('clock-day');
    
    function updateClock() {
        const now = new Date();
        
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        
        if (hourEl) hourEl.textContent = hh;
        if (minuteEl) minuteEl.textContent = mm;
        if (secondEl) secondEl.textContent = ss;
        
        const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = now.toLocaleDateString('tr-TR', dateOptions);
        
        const dayOptions = { weekday: 'long' };
        const dayStr = now.toLocaleDateString('tr-TR', dayOptions);
        
        if (dateEl) dateEl.textContent = dateStr;
        if (dayEl) dayEl.textContent = dayStr;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ----------------------------------------------------
// REAL-TIME SYSTEM UTILIZATION SIMULATION
// ----------------------------------------------------
function initRealtimeSimulation() {
    const cpuValEl = document.getElementById('stat-cpu');
    const cpuProgress = document.getElementById('cpu-progress');
    const ramValEl = document.getElementById('stat-ram');
    const ramProgress = document.getElementById('ram-progress');
    
    if (!cpuValEl || !cpuProgress || !ramValEl || !ramProgress) return;

    function updateSimulation() {
        // Generate random, smooth values
        const lastCpu = systemHistory.cpu[systemHistory.cpu.length - 1] || 15;
        const lastRam = systemHistory.ram[systemHistory.ram.length - 1] || 45;
        
        const cpuChange = (Math.random() - 0.5) * 15;
        const ramChange = (Math.random() - 0.5) * 4;
        
        const newCpu = Math.min(Math.max(Math.round(lastCpu + cpuChange), 5), 95);
        const newRam = Math.min(Math.max(Math.round(lastRam + ramChange), 30), 85);
        
        // Update stats card UI
        cpuValEl.textContent = `${newCpu}%`;
        cpuProgress.style.width = `${newCpu}%`;
        
        ramValEl.textContent = `${newRam}%`;
        ramProgress.style.width = `${newRam}%`;
        
        // Shift history and push new values
        systemHistory.cpu.shift();
        systemHistory.cpu.push(newCpu);
        systemHistory.ram.shift();
        systemHistory.ram.push(newRam);
    }
    
    // Run simulation tick every 2 seconds
    updateSimulation();
    setInterval(updateSimulation, 2000);
}

function initTradingViewWidget() {
    if (typeof TradingView !== 'undefined' && document.getElementById('tradingview_bist')) {
        // Clear previous widget content to avoid overlays on theme switch
        document.getElementById('tradingview_bist').innerHTML = '';
        
        new TradingView.widget({
            "autosize": true,
            "symbol": "BIST:XU100",
            "interval": "D",
            "timezone": "Europe/Istanbul",
            "theme": state.theme === 'light' ? 'light' : 'dark',
            "style": "1",
            "locale": "tr",
            "toolbar_bg": state.theme === 'light' ? '#f1f3f6' : '#1e222d',
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_bist"
        });
    }
}

function updatePerformanceChartColors() {
    // Stubbed out as Chart is replaced by TradingView Widget
}

// ----------------------------------------------------
// OVERVIEW PANEL (WIDGETS & STATS)
// ----------------------------------------------------
function initOverviewPanel() {
    // Quick Note Auto-save jotter
    const quickNoteArea = document.getElementById('quick-note-textarea');
    const quickNoteStatus = document.getElementById('quick-note-status');
    const quickNoteContainer = document.getElementById('quick-note-container');
    const quickNoteStats = document.getElementById('quick-note-stats');
    const sizeSelector = document.getElementById('quick-note-size');
    const copyBtn = document.getElementById('quick-note-copy');
    const clearBtn = document.getElementById('quick-note-clear');
    const colorBtns = document.querySelectorAll('.quick-note-color-btn');
    
    // 1. Initial State Loading
    if (quickNoteArea) {
        quickNoteArea.value = state.quickNote || '';
        quickNoteArea.style.fontSize = state.noteSize || '15px';
    }
    
    if (sizeSelector) {
        sizeSelector.value = state.noteSize || '15px';
    }
    
    if (quickNoteContainer && state.noteBg) {
        quickNoteContainer.style.background = state.noteBg;
        quickNoteContainer.style.borderColor = state.noteBg !== 'rgba(244, 180, 26, 0.0)' ? 'rgba(255,255,255,0.08)' : '';
    }
    
    // Live stats counter helper
    function updateNoteStats() {
        if (!quickNoteArea || !quickNoteStats) return;
        const text = quickNoteArea.value;
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        quickNoteStats.textContent = `${charCount} karakter | ${wordCount} kelime`;
    }
    updateNoteStats();

    // 2. Sizing Action
    if (sizeSelector && quickNoteArea) {
        sizeSelector.addEventListener('change', () => {
            state.noteSize = sizeSelector.value;
            saveState(KEYS.NOTE_SIZE, state.noteSize);
            quickNoteArea.style.fontSize = state.noteSize;
        });
    }

    // 3. Coloring Action
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const bg = btn.dataset.bg;
            state.noteBg = bg;
            saveState(KEYS.NOTE_BG, bg);
            if (quickNoteContainer) {
                quickNoteContainer.style.background = bg;
                // Add soft border styling to highlight customization
                if (bg && bg !== 'rgba(244, 180, 26, 0.0)') {
                    quickNoteContainer.style.border = `1px solid ${btn.dataset.color || 'var(--border-color)'}`;
                } else {
                    quickNoteContainer.style.border = '';
                }
            }
        });
    });

    // 4. Copy to Clipboard
    if (copyBtn && quickNoteArea) {
        copyBtn.addEventListener('click', () => {
            if (quickNoteArea.value.trim() === '') {
                quickNoteStatus.textContent = 'Kopyalanacak metin yok';
                quickNoteStatus.classList.add('visible');
                setTimeout(() => quickNoteStatus.classList.remove('visible'), 1000);
                return;
            }
            navigator.clipboard.writeText(quickNoteArea.value).then(() => {
                quickNoteStatus.textContent = '📋 Kopyalandı!';
                quickNoteStatus.classList.add('visible');
                setTimeout(() => {
                    quickNoteStatus.classList.remove('visible');
                    quickNoteStatus.textContent = 'Kaydedildi';
                }, 1200);
            });
        });
    }

    // 5. Clear text
    if (clearBtn && quickNoteArea) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Not alanını temizlemek istediğinizden emin misiniz?')) {
                quickNoteArea.value = '';
                state.quickNote = '';
                saveState(KEYS.QUICK_NOTE, '');
                updateNoteStats();
                quickNoteStatus.textContent = 'Temizlendi';
                quickNoteStatus.classList.add('visible');
                setTimeout(() => {
                    quickNoteStatus.classList.remove('visible');
                    quickNoteStatus.textContent = 'Kaydedildi';
                }, 1000);
            }
        });
    }

    // 6. Typing Debounce and Save
    let debounceTimer;
    if (quickNoteArea) {
        quickNoteArea.addEventListener('input', () => {
            updateNoteStats();
            if (quickNoteStatus) {
                quickNoteStatus.textContent = 'Kaydediliyor...';
                quickNoteStatus.classList.add('visible');
            }
            
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                state.quickNote = quickNoteArea.value;
                saveState(KEYS.QUICK_NOTE, state.quickNote);
                if (quickNoteStatus) {
                    quickNoteStatus.textContent = 'Kaydedildi';
                    setTimeout(() => {
                        quickNoteStatus.classList.remove('visible');
                    }, 1000);
                }
            }, 800);
        });
    }
    
    // Update stats values initially
    updateOverviewStats();
}

function updateOverviewStats() {
    // Update total balance
    const totalBalance = calculateBalance();
    document.getElementById('stat-balance').textContent = `₺${totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    
    // Balance indicator styling
    const balanceCard = document.getElementById('stat-balance').parentElement;
    const trendEl = balanceCard.querySelector('.stat-trend');
    if (totalBalance >= 0) {
        trendEl.className = 'stat-trend trend-up';
        trendEl.textContent = '↑ Karlı';
    } else {
        trendEl.className = 'stat-trend trend-down';
        trendEl.textContent = '↓ Zararda';
    }
    
    // Update Tasks progress
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.completed).length;
    document.getElementById('stat-tasks').textContent = `${completedTasks} / ${totalTasks}`;
    document.getElementById('task-badge').textContent = totalTasks - completedTasks;
    
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    document.getElementById('stat-tasks-desc').textContent = `Tamamlanma oranı: %${percentage}`;
    
    // Load Mini Transaction List
    const recentList = document.getElementById('recent-transactions-list');
    recentList.innerHTML = '';
    
    const sortedTx = [...state.transactions].sort((a,b) => b.id - a.id).slice(0, 3);
    
    if (sortedTx.length === 0) {
        recentList.innerHTML = `<li class="empty-msg">İşlem kaydı bulunmuyor.</li>`;
    } else {
        sortedTx.forEach(tx => {
            const li = document.createElement('li');
            li.className = `transaction-item-mini ${tx.type}`;
            li.innerHTML = `
                <span>${tx.title}</span>
                <span class="tx-amount ${tx.type}">${tx.type === 'income' ? '+' : '-'}₺${parseFloat(tx.amount).toFixed(2)}</span>
            `;
            recentList.appendChild(li);
        });
    }
}

function calculateBalance() {
    return state.transactions.reduce((acc, tx) => {
        return tx.type === 'income' ? acc + parseFloat(tx.amount) : acc - parseFloat(tx.amount);
    }, 0);
}

// ----------------------------------------------------
// TASKS MODULE (TODO)
// ----------------------------------------------------
let currentTaskFilter = 'all';

function initTasksPanel() {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const taskPriority = document.getElementById('task-priority');
    const taskCategory = document.getElementById('task-category');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTask = {
            id: Date.now(),
            title: taskInput.value,
            priority: taskPriority.value,
            category: taskCategory.value,
            completed: false
        };
        
        state.tasks.push(newTask);
        saveState(KEYS.TASKS, state.tasks);
        
        taskInput.value = '';
        renderTasks();
        updateOverviewStats();
        addNotification(`Yeni görev eklendi: ${newTask.title}`);
        if (typeof initWelcomeBanner === 'function') initWelcomeBanner();
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTaskFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    
    renderTasks();
}

function renderTasks() {
    const listContainer = document.getElementById('todo-list');
    listContainer.innerHTML = '';
    
    let filteredTasks = state.tasks;
    if (currentTaskFilter === 'pending') {
        filteredTasks = state.tasks.filter(t => !t.completed);
    } else if (currentTaskFilter === 'completed') {
        filteredTasks = state.tasks.filter(t => t.completed);
    }
    
    if (filteredTasks.length === 0) {
        listContainer.innerHTML = `<li class="empty-msg">Gösterilecek görev bulunmuyor.</li>`;
        return;
    }
    
    // Sort tasks: pending first, then high priority first
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="todo-left">
                <div class="todo-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id})"></div>
                <div class="todo-title-container">
                    <span class="todo-title">${task.title}</span>
                    <div class="todo-tags">
                        <span class="tag tag-${task.category}">${task.category === 'work' ? 'İş' : task.category === 'personal' ? 'Kişisel' : task.category === 'shopping' ? 'Alışveriş' : 'Diğer'}</span>
                        <span class="priority-badge priority-${task.priority}">${task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}</span>
                    </div>
                </div>
            </div>
            <button class="todo-delete-btn" onclick="deleteTask(${task.id})">
                <svg class="todo-delete-icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
        `;
        listContainer.appendChild(li);
    });
}

window.toggleTask = function(id) {
    state.tasks = state.tasks.map(task => {
        if (task.id === id) {
            const nextCompleted = !task.completed;
            addNotification(`Görev ${nextCompleted ? 'tamamlandı' : 'yapılacak olarak işaretlendi'}: ${task.title}`);
            if (nextCompleted && typeof triggerConfetti === 'function') {
                triggerConfetti();
            }
            return { ...task, completed: nextCompleted };
        }
        return task;
    });
    saveState(KEYS.TASKS, state.tasks);
    renderTasks();
    updateOverviewStats();
    if (typeof initWelcomeBanner === 'function') initWelcomeBanner();
};

window.deleteTask = function(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        addNotification(`Görev silindi: ${task.title}`);
    }
    state.tasks = state.tasks.filter(task => task.id !== id);
    saveState(KEYS.TASKS, state.tasks);
    renderTasks();
    updateOverviewStats();
    if (typeof initWelcomeBanner === 'function') initWelcomeBanner();
};

// ----------------------------------------------------
// BÜTÇE (FINANCE) MODULE
// ----------------------------------------------------
function initFinancePanel() {
    const financeForm = document.getElementById('finance-form');
    const finTitle = document.getElementById('fin-title');
    const finAmount = document.getElementById('fin-amount');
    const finType = document.getElementById('fin-type');
    const finCategory = document.getElementById('fin-category');
    
    financeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTransaction = {
            id: Date.now(),
            title: finTitle.value,
            amount: parseFloat(finAmount.value),
            type: finType.value,
            category: finCategory.value,
            date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        };
        
        state.transactions.push(newTransaction);
        saveState(KEYS.TRANSACTIONS, state.transactions);
        
        finTitle.value = '';
        finAmount.value = '';
        
        renderFinance();
        updateOverviewStats();
        addNotification(`Finans işlemi eklendi: ${newTransaction.title} (₺${newTransaction.amount.toFixed(2)})`);
    });
    
    const searchInput = document.getElementById('finance-search');
    const filterSelect = document.getElementById('finance-filter-type');
    if (searchInput) searchInput.addEventListener('input', () => renderFinance(false));
    if (filterSelect) filterSelect.addEventListener('change', () => renderFinance(false));
    
    initFinancePieChart();
    initFinanceCategoryChart();
    renderFinance();
    if (typeof updateFinanceTrendChart === 'function') updateFinanceTrendChart();
}

let financeCategoryChartInstance = null;
function initFinanceCategoryChart() {
    const canvas = document.getElementById('financeCategoryChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    financeCategoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Fatura', 'Market', 'Kira', 'Eğlence', 'Maaş', 'Diğer'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: ['#f87171', '#fb923c', '#60a5fa', '#c084fc', '#34d399', '#94a3b8'],
                borderWidth: 2,
                borderColor: state.theme === 'dark' ? '#152035' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: state.theme === 'dark' ? '#9ca3af' : '#64748b',
                        font: { family: 'Inter', size: 10 }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function updateFinanceCategoryChart() {
    if (!financeCategoryChartInstance) return;
    
    const categories = ['fatura', 'market', 'kira', 'eglence', 'maas', 'diger'];
    const categoryTotals = { fatura: 0, market: 0, kira: 0, eglence: 0, maas: 0, diger: 0 };
    
    state.transactions.forEach(tx => {
        if (tx.type === 'expense') {
            const cat = tx.category || 'diger';
            if (categoryTotals[cat] !== undefined) {
                categoryTotals[cat] += tx.amount;
            } else {
                categoryTotals.diger += tx.amount;
            }
        }
    });
    
    const data = categories.map(cat => categoryTotals[cat]);
    financeCategoryChartInstance.data.datasets[0].data = data;
    financeCategoryChartInstance.data.datasets[0].borderColor = state.theme === 'dark' ? '#152035' : '#ffffff';
    financeCategoryChartInstance.options.plugins.legend.labels.color = state.theme === 'dark' ? '#9ca3af' : '#64748b';
    financeCategoryChartInstance.update();
}

function initFinancePieChart() {
    const ctx = document.getElementById('financePieChart').getContext('2d');
    
    financePieChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gelir', 'Gider'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 2,
                borderColor: state.theme === 'dark' ? '#152035' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: state.theme === 'dark' ? '#9ca3af' : '#64748b',
                        font: { family: 'Inter', size: 12 }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

function renderFinance(updateSummary = true) {
    const ledgerBody = document.getElementById('ledger-body');
    if (!ledgerBody) return;
    ledgerBody.innerHTML = '';
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    // Always compute totals over all transactions
    state.transactions.forEach(tx => {
        if (tx.type === 'income') totalIncome += tx.amount;
        else totalExpense += tx.amount;
    });

    const searchQuery = document.getElementById('finance-search')?.value.toLowerCase() || '';
    const filterType = document.getElementById('finance-filter-type')?.value || 'all';
    
    const filteredTransactions = state.transactions.filter(tx => {
        const titleMatch = tx.title.toLowerCase().includes(searchQuery);
        const catNameMap = {
            fatura: 'fatura',
            market: 'market gıda market/gıda',
            kira: 'kira',
            eglence: 'eğlence sosyal eğlence/sosyal',
            maas: 'maaş',
            diger: 'diğer'
        };
        const catMatch = (catNameMap[tx.category] || 'diğer').includes(searchQuery) || (tx.category || '').includes(searchQuery);
        const matchesSearch = titleMatch || catMatch;
        const matchesType = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesType;
    });
    
    filteredTransactions.forEach(tx => {
        const tr = document.createElement('tr');
        const catLabels = {
            fatura: 'Fatura',
            market: 'Market / Gıda',
            kira: 'Kira',
            eglence: 'Eğlence / Sosyal',
            maas: 'Maaş',
            diger: 'Diğer'
        };
        const displayCategory = catLabels[tx.category] || 'Diğer';
        tr.innerHTML = `
            <td>${tx.title}</td>
            <td><span class="badge-cat">${displayCategory}</span></td>
            <td><span class="badge-fin-type ${tx.type}">${tx.type === 'income' ? 'Gelir' : 'Gider'}</span></td>
            <td class="tx-amount ${tx.type}">₺${tx.amount.toFixed(2)}</td>
            <td>${tx.date}</td>
            <td>
                <button class="todo-delete-btn" onclick="deleteTransaction(${tx.id})">
                    <svg class="todo-delete-icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </td>
        `;
        ledgerBody.appendChild(tr);
    });
    
    if (filteredTransactions.length === 0) {
        ledgerBody.innerHTML = `<tr><td colspan="6" class="empty-msg">İşlem kaydı bulunmuyor.</td></tr>`;
    }
    
    if (updateSummary) {
        // Update summary texts
        document.getElementById('fin-income-total').textContent = `₺${totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
        document.getElementById('fin-expense-total').textContent = `₺${totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
        
        // Update charts
        if (financePieChartInstance) {
            financePieChartInstance.data.datasets[0].data = [totalIncome, totalExpense];
            financePieChartInstance.data.datasets[0].borderColor = state.theme === 'dark' ? '#152035' : '#ffffff';
            financePieChartInstance.options.plugins.legend.labels.color = state.theme === 'dark' ? '#9ca3af' : '#64748b';
            financePieChartInstance.update();
        }
        
        updateFinanceCategoryChart();

        if (typeof updateFinanceTrendChart === 'function') {
            updateFinanceTrendChart();
        }
    }
}

window.deleteTransaction = function(id) {
    const tx = state.transactions.find(t => t.id === id);
    if (tx) {
        addNotification(`Finans işlemi silindi: ${tx.title}`);
    }
    state.transactions = state.transactions.filter(tx => tx.id !== id);
    saveState(KEYS.TRANSACTIONS, state.transactions);
    renderFinance();
    updateOverviewStats();
};

// ----------------------------------------------------
// NOTES TRACKER MODULE
// ----------------------------------------------------
function initNotesPanel() {
    const newNoteBtn = document.getElementById('new-note-btn');
    const noteTitleInput = document.getElementById('note-title-input');
    const noteBodyInput = document.getElementById('note-body-input');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const noteSaveIndicator = document.getElementById('note-save-status');
    const colorDots = document.querySelectorAll('#note-color-picker .color-dot');
    
    newNoteBtn.addEventListener('click', () => {
        const newNote = {
            id: Date.now().toString(),
            title: 'Yeni Not',
            body: '',
            color: 'default',
            date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
        };
        
        state.notes.unshift(newNote);
        saveState(KEYS.NOTES, state.notes);
        
        state.activeNoteId = newNote.id;
        saveState(KEYS.ACTIVE_NOTE_ID, state.activeNoteId);
        
        renderNotesSidebar();
        selectNote(newNote.id);
        addNotification("Yeni bir not oluşturuldu.");
    });
    
    deleteNoteBtn.addEventListener('click', () => {
        if (!state.activeNoteId) return;
        
        const note = state.notes.find(n => n.id === state.activeNoteId);
        if (note) {
            addNotification(`Not silindi: ${note.title}`);
        }
        
        state.notes = state.notes.filter(n => n.id !== state.activeNoteId);
        saveState(KEYS.NOTES, state.notes);
        
        state.activeNoteId = state.notes.length > 0 ? state.notes[0].id : null;
        saveState(KEYS.ACTIVE_NOTE_ID, state.activeNoteId);
        
        renderNotesSidebar();
        if (state.activeNoteId) {
            selectNote(state.activeNoteId);
        } else {
            clearNoteEditor();
        }
    });
    
    // Bind color dot click handlers
    colorDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            if (!state.activeNoteId) return;
            
            const color = dot.dataset.color;
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            state.notes = state.notes.map(n => {
                if (n.id === state.activeNoteId) {
                    return { ...n, color: color };
                }
                return n;
            });
            saveState(KEYS.NOTES, state.notes);
            renderNotesSidebar();
            
            const editor = document.getElementById('note-editor-container');
            if (editor) {
                editor.className = `card-panel note-editor note-${color}`;
            }
        });
    });
    
    // Auto-save logic on input
    let noteSaveDebounce;
    function triggerNoteSave() {
        if (!state.activeNoteId) return;
        
        noteSaveIndicator.textContent = 'Kaydediliyor...';
        noteSaveIndicator.classList.add('visible');
        
        clearTimeout(noteSaveDebounce);
        noteSaveDebounce = setTimeout(() => {
            state.notes = state.notes.map(note => {
                if (note.id === state.activeNoteId) {
                    return {
                        ...note,
                        title: noteTitleInput.value || 'Başlıksız Not',
                        body: noteBodyInput.value
                    };
                }
                return note;
            });
            saveState(KEYS.NOTES, state.notes);
            
            // Update sidebar title dynamically
            const activeSidebarItem = document.querySelector(`.note-item[data-id="${state.activeNoteId}"] .note-item-title`);
            if (activeSidebarItem) {
                activeSidebarItem.textContent = noteTitleInput.value || 'Başlıksız Not';
            }
            
            noteSaveIndicator.textContent = 'Kaydedildi';
            setTimeout(() => {
                noteSaveIndicator.classList.remove('visible');
            }, 1000);
        }, 800);
    }
    
    noteTitleInput.addEventListener('input', triggerNoteSave);
    noteBodyInput.addEventListener('input', triggerNoteSave);
    
    renderNotesSidebar();
    if (state.activeNoteId && state.notes.some(n => n.id === state.activeNoteId)) {
        selectNote(state.activeNoteId);
    } else if (state.notes.length > 0) {
        selectNote(state.notes[0].id);
    } else {
        clearNoteEditor();
    }
}

function renderNotesSidebar() {
    const list = document.getElementById('notes-sidebar-list');
    list.innerHTML = '';
    
    if (state.notes.length === 0) {
        list.innerHTML = `<li class="empty-msg">Kayıtlı not bulunmuyor.</li>`;
        return;
    }
    
    state.notes.forEach(note => {
        const li = document.createElement('li');
        const noteColor = note.color || 'default';
        li.className = `note-item note-${noteColor} ${note.id === state.activeNoteId ? 'active' : ''}`;
        li.dataset.id = note.id;
        li.innerHTML = `
            <div class="note-item-title">${note.title || 'Başlıksız Not'}</div>
            <div class="note-item-date">${note.date}</div>
        `;
        
        li.addEventListener('click', () => {
            document.querySelectorAll('.note-item').forEach(el => el.classList.remove('active'));
            li.classList.add('active');
            selectNote(note.id);
        });
        
        list.appendChild(li);
    });
}

function selectNote(id) {
    state.activeNoteId = id;
    saveState(KEYS.ACTIVE_NOTE_ID, id);
    
    const note = state.notes.find(n => n.id === id);
    if (!note) return;
    
    const noteTitleInput = document.getElementById('note-title-input');
    const noteBodyInput = document.getElementById('note-body-input');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    
    noteTitleInput.removeAttribute('disabled');
    noteBodyInput.removeAttribute('disabled');
    deleteNoteBtn.removeAttribute('disabled');
    
    noteTitleInput.value = note.title;
    noteBodyInput.value = note.body;
    
    // Highlight the active dot
    const noteColor = note.color || 'default';
    const colorDots = document.querySelectorAll('#note-color-picker .color-dot');
    colorDots.forEach(d => {
        if (d.dataset.color === noteColor) {
            d.classList.add('active');
        } else {
            d.classList.remove('active');
        }
    });
    
    // Apply background color to editor wrapper
    const editor = document.getElementById('note-editor-container');
    if (editor) {
        editor.className = `card-panel note-editor note-${noteColor}`;
    }
}

function clearNoteEditor() {
    const noteTitleInput = document.getElementById('note-title-input');
    const noteBodyInput = document.getElementById('note-body-input');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    
    noteTitleInput.setAttribute('disabled', 'true');
    noteBodyInput.setAttribute('disabled', 'true');
    deleteNoteBtn.setAttribute('disabled', 'true');
    
    noteTitleInput.value = '';
    noteBodyInput.value = '';
    
    const editor = document.getElementById('note-editor-container');
    if (editor) {
        editor.className = `card-panel note-editor`;
    }
    const colorDots = document.querySelectorAll('#note-color-picker .color-dot');
    colorDots.forEach(d => d.classList.remove('active'));
}

// ----------------------------------------------------
// SETTINGS MODULE
// ----------------------------------------------------
function initSettingsPanel() {
    const settingsForm = document.getElementById('settings-form');
    const settingsUsername = document.getElementById('settings-username');
    const settingsCity = document.getElementById('settings-city');
    const clearAllDataBtn = document.getElementById('clear-all-data-btn');
    const avatarPicker = document.getElementById('avatar-picker');
    const avatarFileInput = document.getElementById('settings-avatar-file');
    
    // Init values
    settingsUsername.value = state.username;
    if (settingsCity) {
        settingsCity.value = state.city || 'İzmir';
    }
    
    // Helper to clear active class from all options
    function clearActiveAvatars() {
        if (avatarPicker) {
            avatarPicker.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('active'));
        }
    }
    
    // Check if current avatar is a custom uploaded image (base64)
    const isCustomAvatar = state.avatar && state.avatar.startsWith('data:image/');
    
    if (avatarPicker) {
        // Render existing custom avatar if present
        if (isCustomAvatar) {
            const customOpt = document.createElement('div');
            customOpt.className = 'avatar-option active';
            customOpt.dataset.char = state.avatar;
            customOpt.dataset.custom = 'true';
            customOpt.style.backgroundImage = `url("${state.avatar}")`;
            customOpt.style.backgroundSize = 'cover';
            customOpt.style.backgroundPosition = 'center';
            customOpt.textContent = '';
            avatarPicker.appendChild(customOpt);
            
            customOpt.addEventListener('click', () => {
                clearActiveAvatars();
                customOpt.classList.add('active');
            });
        }
        
        // Highlight correct avatar in picker
        const avatarOptions = avatarPicker.querySelectorAll('.avatar-option');
        avatarOptions.forEach(opt => {
            if (!isCustomAvatar && opt.dataset.char === state.avatar) {
                opt.classList.add('active');
            } else if (!isCustomAvatar && !state.avatar && opt.dataset.char === 'E') {
                opt.classList.add('active'); // Default fallback
            }
            
            opt.addEventListener('click', () => {
                clearActiveAvatars();
                opt.classList.add('active');
            });
        });
    }
    
    // Handle File Input Change
    if (avatarFileInput && avatarPicker) {
        avatarFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const base64Image = evt.target.result;
                    
                    // Remove any previous custom avatar option
                    const oldCustom = avatarPicker.querySelector('.avatar-option[data-custom="true"]');
                    if (oldCustom) {
                        oldCustom.remove();
                    }
                    
                    // Create new custom option
                    const newCustomOpt = document.createElement('div');
                    newCustomOpt.className = 'avatar-option active';
                    newCustomOpt.dataset.char = base64Image;
                    newCustomOpt.dataset.custom = 'true';
                    newCustomOpt.style.backgroundImage = `url("${base64Image}")`;
                    newCustomOpt.style.backgroundSize = 'cover';
                    newCustomOpt.style.backgroundPosition = 'center';
                    newCustomOpt.textContent = '';
                    
                    // Deactivate all others
                    clearActiveAvatars();
                    
                    // Append and bind click
                    avatarPicker.appendChild(newCustomOpt);
                    newCustomOpt.addEventListener('click', () => {
                        clearActiveAvatars();
                        newCustomOpt.classList.add('active');
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    updateUsernameUI();
    
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        state.username = settingsUsername.value || 'Kullanıcı';
        saveState(KEYS.USERNAME, state.username);
        
        if (settingsCity) {
            state.city = settingsCity.value.trim() || 'İzmir';
            saveState(KEYS.CITY, state.city);
            updateWeather();
        }
        
        // Save selected avatar
        if (avatarPicker) {
            const selectedAvatarOpt = avatarPicker.querySelector('.avatar-option.active');
            if (selectedAvatarOpt) {
                state.avatar = selectedAvatarOpt.dataset.char;
                saveState(KEYS.AVATAR, state.avatar);
                
                // If it is a character (not custom image), sync with login avatar in parent key if needed
                if (!state.avatar.startsWith('data:image/')) {
                    localStorage.setItem('novadash_avatar', state.avatar);
                } else {
                    localStorage.setItem('novadash_avatar', '📸'); // Use camera emoji as general fallback for base64 in short areas if needed
                }
            }
        }
        
        updateUsernameUI();
        if (typeof initWelcomeBanner === 'function') initWelcomeBanner();
        addNotification("Profil bilgileri başarıyla güncellendi.");
        
        // Show indicator / Save effect
        const submitBtn = settingsForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Kaydedildi!';
        submitBtn.style.backgroundColor = '#10b981';
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
        }, 1500);
    });
    
    clearAllDataBtn.addEventListener('click', () => {
        if (confirm('Tüm verilerinizi (görevler, işlemler, notlar) sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            // Sadece bu kullanıcıya ait verileri temizle
            Object.values(KEYS).forEach(key => localStorage.removeItem(key));
            localStorage.removeItem('auth_crud_current_user');
            
            // Reset local state
            state = {
                theme: 'dark',
                accent: '#3b82f6',
                username: loggedInUser ? loggedInUser.name : 'Ege Kolatan',
                tasks: [],
                transactions: [],
                notes: [],
                quickNote: '',
                activeNoteId: null
            };
            
            // Giriş sayfasına yönlendir (çünkü kullanıcı verisi ve oturum silindi)
            window.location.href = '../auth-crud/';
        }
    });
}

function updateUsernameUI() {
    document.getElementById('display-username').textContent = state.username;
    
    const avatarEl = document.getElementById('user-avatar-initial');
    if (avatarEl) {
        if (state.avatar && (state.avatar.startsWith('data:image/') || state.avatar.startsWith('http://') || state.avatar.startsWith('https://') || state.avatar.startsWith('/'))) {
            avatarEl.style.backgroundImage = `url("${state.avatar}")`;
            avatarEl.style.backgroundSize = 'cover';
            avatarEl.style.backgroundPosition = 'center';
            avatarEl.textContent = '';
        } else {
            avatarEl.style.backgroundImage = '';
            avatarEl.textContent = state.avatar || 'K';
        }
    }
    
    // Profil alanına tıklanınca çıkış yapma özelliği ekle
    const profile = document.querySelector('.user-profile');
    if (profile) {
        profile.style.cursor = 'pointer';
        profile.title = 'Çıkış yapmak için tıklayın';
        profile.onclick = () => {
            if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
                localStorage.removeItem('auth_crud_current_user');
                window.location.href = '../auth-crud/';
            }
        };
    }
}

// ----------------------------------------------------
// BİLDİRİM MERKEZİ MANTIĞI
// ----------------------------------------------------
function addNotification(message) {
    const notif = {
        id: Date.now(),
        message: message,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    state.notifications.unshift(notif);
    if (state.notifications.length > 20) {
        state.notifications.pop();
    }
    saveState(KEYS.NOTIFICATIONS, state.notifications);
    renderNotifications();
}

function renderNotifications() {
    const listEl = document.getElementById('notif-list-container');
    const badgeEl = document.getElementById('notif-badge-count');
    if (!listEl || !badgeEl) return;
    
    const count = state.notifications.length;
    if (count > 0) {
        badgeEl.textContent = count;
        badgeEl.classList.remove('hidden');
    } else {
        badgeEl.classList.add('hidden');
    }
    
    if (state.notifications.length === 0) {
        listEl.innerHTML = '<li class="empty-notif-msg">Yeni bildirim bulunmuyor.</li>';
        return;
    }
    
    listEl.innerHTML = state.notifications.map(n => `
        <li class="notif-item">
            <span>${n.message}</span>
            <span class="notif-time">${n.time}</span>
        </li>
    `).join('');
}

function initNotifications() {
    const trigger = document.getElementById('notif-trigger');
    const dropdown = document.getElementById('notif-dropdown');
    const clearBtn = document.getElementById('clear-notifs-btn');
    
    if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== trigger) {
                dropdown.classList.remove('active');
            }
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            state.notifications = [];
            saveState(KEYS.NOTIFICATIONS, state.notifications);
            renderNotifications();
        });
    }
    renderNotifications();
}

// ----------------------------------------------------
// AKILLI KARŞILAMA PANELİ MANTIĞI
// ----------------------------------------------------
function initWelcomeBanner() {
    const greetingEl = document.getElementById('welcome-greeting-text');
    const messageEl = document.getElementById('welcome-message-text');
    if (!greetingEl || !messageEl) return;
    
    const hour = new Date().getHours();
    let greeting = 'İyi Günler';
    if (hour >= 5 && hour < 12) {
        greeting = 'Günaydın';
    } else if (hour >= 12 && hour < 18) {
        greeting = 'İyi Günler';
    } else if (hour >= 18 && hour < 23) {
        greeting = 'İyi Akşamlar';
    } else {
        greeting = 'İyi Geceler';
    }
    
    greetingEl.textContent = `${greeting}, ${state.username}!`;
    
    const pendingTasks = state.tasks.filter(t => !t.completed).length;
    if (pendingTasks > 0) {
        messageEl.textContent = `Bugün tamamlamanız gereken ${pendingTasks} aktif göreviniz bulunuyor. Kolay gelsin!`;
    } else {
        messageEl.textContent = `Harika! Bugün yapılması gereken hiç göreviniz kalmadı.`;
    }
}

// ----------------------------------------------------
// POMODORO SAYACI MANTIĞI
// ----------------------------------------------------
let pomodoroInterval = null;
let pomodoroTimeLeft = 25 * 60;
let pomodoroIsRunning = false;
let pomodoroMode = 'work';

function initPomodoro() {
    const startBtn = document.getElementById('pomodoro-start');
    const resetBtn = document.getElementById('pomodoro-reset');
    const workBtn = document.getElementById('mode-work');
    const breakBtn = document.getElementById('mode-break');
    
    if (!startBtn) return;
    
    startBtn.addEventListener('click', () => {
        if (pomodoroIsRunning) {
            clearInterval(pomodoroInterval);
            pomodoroIsRunning = false;
            startBtn.textContent = 'Başlat';
            addNotification("Pomodoro zamanlayıcı duraklatıldı.");
        } else {
            pomodoroIsRunning = true;
            startBtn.textContent = 'Duraklat';
            addNotification("Pomodoro zamanlayıcı başlatıldı.");
            
            pomodoroInterval = setInterval(() => {
                pomodoroTimeLeft--;
                updatePomodoroDisplay();
                
                if (pomodoroTimeLeft <= 0) {
                    clearInterval(pomodoroInterval);
                    pomodoroIsRunning = false;
                    startBtn.textContent = 'Başlat';
                    
                    playPomodoroSound();
                    
                    if (pomodoroMode === 'work') {
                        addNotification("Tebrikler! Pomodoro seansı bitti. Mola zamanı!");
                        alert("Pomodoro seansı bitti! Mola verin.");
                        setPomodoroMode('break');
                    } else {
                        addNotification("Mola bitti! Çalışma seansına başlayabilirsiniz.");
                        alert("Mola bitti! Çalışma zamanı.");
                        setPomodoroMode('work');
                    }
                }
            }, 1000);
        }
    });
    
    resetBtn.addEventListener('click', () => {
        clearInterval(pomodoroInterval);
        pomodoroIsRunning = false;
        startBtn.textContent = 'Başlat';
        pomodoroTimeLeft = pomodoroMode === 'work' ? 25 * 60 : 5 * 60;
        updatePomodoroDisplay();
        addNotification("Pomodoro zamanlayıcı sıfırlandı.");
    });
    
    if (workBtn) workBtn.addEventListener('click', () => setPomodoroMode('work'));
    if (breakBtn) breakBtn.addEventListener('click', () => setPomodoroMode('break'));
    
    updatePomodoroDisplay();
}

function setPomodoroMode(mode) {
    const startBtn = document.getElementById('pomodoro-start');
    const workBtn = document.getElementById('mode-work');
    const breakBtn = document.getElementById('mode-break');
    
    pomodoroMode = mode;
    clearInterval(pomodoroInterval);
    pomodoroIsRunning = false;
    if (startBtn) startBtn.textContent = 'Başlat';
    
    if (mode === 'work') {
        pomodoroTimeLeft = 25 * 60;
        if (workBtn) workBtn.classList.add('active');
        if (breakBtn) breakBtn.classList.remove('active');
    } else {
        pomodoroTimeLeft = 5 * 60;
        if (breakBtn) breakBtn.classList.add('active');
        if (workBtn) workBtn.classList.remove('active');
    }
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const timeEl = document.getElementById('pomodoro-time');
    const progressEl = document.getElementById('pomodoro-progress');
    if (!timeEl || !progressEl) return;
    
    const mins = Math.floor(pomodoroTimeLeft / 60);
    const secs = pomodoroTimeLeft % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    timeEl.textContent = timeStr;
    
    document.title = pomodoroIsRunning ? `(${timeStr}) Gelişmiş Dashboard` : 'Gelişmiş Dashboard';
    
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const totalDuration = pomodoroMode === 'work' ? 25 * 60 : 5 * 60;
    const progress = (totalDuration - pomodoroTimeLeft) / totalDuration;
    const offset = circumference - (progress * circumference);
    
    progressEl.style.strokeDasharray = `${circumference} ${circumference}`;
    progressEl.style.strokeDashoffset = offset;
}

function playPomodoroSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            audioCtx.close();
        }, 300);
    } catch (err) {
        console.error("Audio Context error:", err);
    }
}

// ----------------------------------------------------
// FİNANS TREND ÇİZGİ GRAFİK MANTIĞI
// ----------------------------------------------------
let financeTrendChartInstance = null;
function updateFinanceTrendChart() {
    const canvas = document.getElementById('financeTrendChart');
    if (!canvas) return;
    
    const dailyData = {};
    state.transactions.forEach(t => {
        const dateStr = t.date;
        if (!dailyData[dateStr]) {
            dailyData[dateStr] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') {
            dailyData[dateStr].income += t.amount;
        } else {
            dailyData[dateStr].expense += t.amount;
        }
    });
    
    const sortedDates = Object.keys(dailyData).sort();
    const incomeData = [];
    const expenseData = [];
    
    sortedDates.forEach(d => {
        incomeData.push(dailyData[d].income);
        expenseData.push(dailyData[d].expense);
    });
    
    if (financeTrendChartInstance) {
        financeTrendChartInstance.destroy();
    }
    
    const labels = sortedDates.length > 0 ? sortedDates : ['Ocak', 'Şubat', 'Mart'];
    const finalIncome = sortedDates.length > 0 ? incomeData : [0, 0, 0];
    const finalExpense = sortedDates.length > 0 ? expenseData : [0, 0, 0];
    
    financeTrendChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gelir',
                    data: finalIncome,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Gider',
                    data: finalExpense,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            }
        }
    });
}

// ----------------------------------------------------
// MOTİVASYON SÖZLERİ VERİ BANKASI
// ----------------------------------------------------
const MOTIVATIONAL_QUOTES = [
    "Hayal edebildiğin her şey gerçektir. - Pablo Picasso",
    "Gelecek, bugünden ona hazırlananlarındır. - Malcolm X",
    "Düşünmek kolaydır, yapmak zordur. - Goethe",
    "Başarı bir yolculuktur, varış noktası değil. - Ben Sweetland",
    "Odaklanmak, hayır diyebilme sanatıdır. - Steve Jobs",
    "Küçük adımlar, büyük sonuçlar doğurur. - Anonim",
    "Bugün yapacağın şeyler, yarınki seni belirler. - Anonim"
];

// ----------------------------------------------------
// KLAVYE KISAYOLLARI VE YARDIM MODALI
// ----------------------------------------------------
function initShortcuts() {
    const modal = document.getElementById('shortcut-modal');
    const closeBtn = document.getElementById('shortcut-close');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    window.addEventListener('keyup', (e) => {
        const activeTag = document.activeElement.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
            // Form elemanına yazarken kısayollar çalışmasın
            if (e.key === 'Escape') {
                document.activeElement.blur();
            }
            return;
        }
        
        const key = e.key.toLowerCase();
        
        // Escape ile modali/dropdownları kapa
        if (e.key === 'Escape') {
            if (modal) modal.classList.remove('active');
            const notifDropdown = document.getElementById('notif-dropdown');
            if (notifDropdown) notifDropdown.classList.remove('active');
        }
        
        // ? Tuşu kılavuzu açar/kapatır
        if (e.key === '?' || e.key === '/') {
            if (modal) modal.classList.toggle('active');
        }
        
        // Sekmeler arası geçiş kısayolları
        let targetTab = null;
        if (key === '1' || key === 'o') targetTab = 'overview';
        if (key === '2' || key === 't') targetTab = 'tasks';
        if (key === '3' || key === 'f') targetTab = 'finance';
        if (key === '4' || key === 'n') targetTab = 'notes';
        if (key === '5' || key === 's') targetTab = 'settings';
        
        if (targetTab) {
            const btn = document.querySelector(`.nav-item[data-tab="${targetTab}"]`);
            if (btn) btn.click();
        }
        
        // Pomodoro kısayolu
        if (key === 'p') {
            const startBtn = document.getElementById('pomodoro-start');
            if (startBtn) startBtn.click();
        }
    });
}

// Akıllı Karşılama Kartına Motivasyon Sözü Yüklenmesi
const originalInitWelcome = initWelcomeBanner;
initWelcomeBanner = function() {
    if (typeof originalInitWelcome === 'function') originalInitWelcome();
    
    const quoteEl = document.getElementById('welcome-quote-el');
    if (quoteEl) {
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        quoteEl.innerHTML = `💡 <em>${MOTIVATIONAL_QUOTES[randomIndex]}</em>`;
    }
};

// ----------------------------------------------------
// SAF JAVASCRIPT KONFETİ MOTORU (PERFORMANS DOSTU)
// ----------------------------------------------------
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Pencere boyutu değiştiğinde canvası güncelle
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, { once: true });
    
    const colors = ['#f87171', '#60a5fa', '#34d399', '#fb923c', '#c084fc', '#f472b6', '#fbbf24'];
    const particles = [];
    
    // 100 partikül oluştur
    for (let i = 0; i < 120; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height + 20,
            r: Math.random() * 6 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0,
            // Hız ve fırlatma yönü
            vx: Math.random() * 20 - 10,
            vy: -Math.random() * 15 - 10,
            gravity: 0.3
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeParticles = false;
        
        particles.forEach(p => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += p.vy;
            p.x += p.vx;
            p.vy += p.gravity;
            p.tilt = Math.sin(p.tiltAngle) * 12;
            
            // Eğer ekrandaysa çiz
            if (p.y <= canvas.height) {
                activeParticles = true;
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                ctx.stroke();
            }
        });
        
        if (activeParticles) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    draw();
}

// ----------------------------------------------------
// GERÇEK ZAMANLI HAVA DURUMU SİSTEMİ (OPEN-METEO INTEGRATION)
// ----------------------------------------------------

function getWeatherDetails(code) {
    const mapping = {
        0: { icon: '☀️', desc: 'Açık Güneşli' },
        1: { icon: '🌤️', desc: 'Çoğunlukla Açık' },
        2: { icon: '⛅', desc: 'Parçalı Bulutlu' },
        3: { icon: '☁️', desc: 'Bulutlu / Kapalı' },
        45: { icon: '🌫️', desc: 'Sisli' },
        48: { icon: '🌫️', desc: 'Kırağı Sisli' },
        51: { icon: '🌧️', desc: 'Hafif Çisenti' },
        53: { icon: '🌧️', desc: 'Çisenti' },
        55: { icon: '🌧️', desc: 'Yoğun Çisenti' },
        61: { icon: '🌧️', desc: 'Hafif Yağmurlu' },
        63: { icon: '🌧️', desc: 'Yağmurlu' },
        65: { icon: '🌧️', desc: 'Şiddetli Yağmurlu' },
        71: { icon: '❄️', desc: 'Hafif Karlı' },
        73: { icon: '❄️', desc: 'Karlı' },
        75: { icon: '❄️', desc: 'Yoğun Karlı' },
        77: { icon: '❄️', desc: 'Kar Atıştırmalı' },
        80: { icon: '🌧️', desc: 'Hafif Sağanak' },
        81: { icon: '🌧️', desc: 'Sağanak Yağışlı' },
        82: { icon: '🌧️', desc: 'Şiddetli Sağanak' },
        85: { icon: '❄️', desc: 'Kar Sağanağı' },
        86: { icon: '❄️', desc: 'Yoğun Kar Sağanağı' },
        95: { icon: '⛈️', desc: 'Gök Gürültülü Fırtına' },
        96: { icon: '⛈️', desc: 'Gök Gürültülü Hafif Dolu' },
        99: { icon: '⛈️', desc: 'Gök Gürültülü Yoğun Dolu' }
    };
    return mapping[code] || { icon: '☀️', desc: 'Açık' };
}

async function updateWeather() {
    const tempEl = document.getElementById('weather-temp-el');
    const cityEl = document.getElementById('weather-city-el');
    const iconEl = document.getElementById('weather-icon-el');
    const descEl = document.getElementById('weather-desc-el');
    const feelsEl = document.getElementById('weather-feels-el');
    const humidityEl = document.getElementById('weather-humidity-el');
    const windEl = document.getElementById('weather-wind-el');
    
    if (!tempEl || !cityEl) return;
    
    const city = state.city || 'İzmir';
    cityEl.textContent = city;
    
    try {
        // 1. Geocode City to Coordinates
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=tr`;
        const geoRes = await fetch(geocodeUrl);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            cityEl.textContent = 'Bilinmeyen Şehir';
            return;
        }
        
        const loc = geoData.results[0];
        const lat = loc.latitude;
        const lon = loc.longitude;
        const countryName = loc.country || 'TR';
        
        cityEl.textContent = `${loc.name}, ${countryName}`;
        
        // 2. Fetch Forecast Weather Data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        
        if (!weatherData.current) return;
        
        const current = weatherData.current;
        const temp = Math.round(current.temperature_2m);
        const feels = Math.round(current.apparent_temperature);
        const humidity = current.relative_humidity_2m;
        const wind = Math.round(current.wind_speed_10m);
        const weatherCode = current.weather_code;
        
        const details = getWeatherDetails(weatherCode);
        
        // DOM Updates
        tempEl.textContent = `${temp}°C`;
        if (iconEl) iconEl.textContent = details.icon;
        if (descEl) descEl.textContent = `Durum: ${details.desc}`;
        if (feelsEl) feelsEl.textContent = `Hissedilen: ${feels}°C`;
        if (humidityEl) humidityEl.textContent = `💧 Nem: %${humidity}`;
        if (windEl) windEl.textContent = `💨 Rüzgar: ${wind} km/h`;
        
    } catch (e) {
        console.error('Hava durumu verisi alınamadı:', e);
        cityEl.textContent = 'Bağlantı Hatası';
    }
}

