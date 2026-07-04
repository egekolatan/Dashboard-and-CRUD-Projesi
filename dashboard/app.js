// Giriş Doğrulama Kontrolü (Güvenlik Kapısı)
const loggedInUser = JSON.parse(localStorage.getItem('auth_crud_current_user'));
if (!loggedInUser || loggedInUser.email !== 'egekolatan114@gmail.com') {
    // Giriş yapılmadıysa veya yanlış kullanıcıysa doğrudan giriş sayfasına yönlendir
    window.location.href = '../auth-crud/index.html';
}

// App State Managers & Storage Keys
const KEYS = {
    THEME: 'novadash_theme',
    ACCENT: 'novadash_accent',
    USERNAME: 'novadash_username',
    TASKS: 'novadash_tasks',
    TRANSACTIONS: 'novadash_transactions',
    NOTES: 'novadash_notes',
    QUICK_NOTE: 'novadash_quick_note',
    ACTIVE_NOTE_ID: 'novadash_active_note_id'
};

// State Object
let state = {
    theme: localStorage.getItem(KEYS.THEME) || 'dark',
    accent: localStorage.getItem(KEYS.ACCENT) || '#3b82f6',
    username: localStorage.getItem(KEYS.USERNAME) || 'Ege Kolatan',
    tasks: JSON.parse(localStorage.getItem(KEYS.TASKS)) || [],
    transactions: JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS)) || [],
    notes: JSON.parse(localStorage.getItem(KEYS.NOTES)) || [],
    quickNote: localStorage.getItem(KEYS.QUICK_NOTE) || '',
    activeNoteId: localStorage.getItem(KEYS.ACTIVE_NOTE_ID) || null
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
    initOverviewPanel();
    initTasksPanel();
    initFinancePanel();
    initNotesPanel();
    initSettingsPanel();
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
    
    // Re-render charts to look good on the new theme background if they exist
    if (performanceChartInstance) {
        updatePerformanceChartColors();
    }
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
    const dateTimeEl = document.getElementById('current-date-time');
    
    function updateClock() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('tr-TR', options);
        const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dateTimeEl.textContent = `${dateStr} | ${timeStr}`;
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
    
    // Setup Chart.js Performance Chart
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    performanceChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: systemHistory.labels,
            datasets: [
                {
                    label: 'CPU',
                    data: systemHistory.cpu,
                    borderColor: state.accent,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                },
                {
                    label: 'RAM',
                    data: systemHistory.ram,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { display: false },
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        color: state.theme === 'dark' ? '#9ca3af' : '#64748b',
                        font: { family: 'Inter' }
                    },
                    grid: {
                        color: state.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                    }
                }
            }
        }
    });

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
        
        // Update chart
        performanceChartInstance.update('none');
    }
    
    // Run simulation tick every 2 seconds
    updateSimulation();
    setInterval(updateSimulation, 2000);
}

function updatePerformanceChartColors() {
    if (!performanceChartInstance) return;
    
    performanceChartInstance.data.datasets[0].borderColor = state.accent;
    performanceChartInstance.options.scales.y.ticks.color = state.theme === 'dark' ? '#9ca3af' : '#64748b';
    performanceChartInstance.options.scales.y.grid.color = state.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    performanceChartInstance.update();
}

// ----------------------------------------------------
// OVERVIEW PANEL (WIDGETS & STATS)
// ----------------------------------------------------
function initOverviewPanel() {
    // Quick Note Auto-save jotter
    const quickNoteArea = document.getElementById('quick-note-textarea');
    const quickNoteStatus = document.getElementById('quick-note-status');
    
    quickNoteArea.value = state.quickNote;
    
    let debounceTimer;
    quickNoteArea.addEventListener('input', () => {
        quickNoteStatus.textContent = 'Kaydediliyor...';
        quickNoteStatus.classList.add('visible');
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            state.quickNote = quickNoteArea.value;
            saveState(KEYS.QUICK_NOTE, state.quickNote);
            quickNoteStatus.textContent = 'Kaydedildi';
            setTimeout(() => {
                quickNoteStatus.classList.remove('visible');
            }, 1000);
        }, 800);
    });
    
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
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveState(KEYS.TASKS, state.tasks);
    renderTasks();
    updateOverviewStats();
};

window.deleteTask = function(id) {
    state.tasks = state.tasks.filter(task => task.id !== id);
    saveState(KEYS.TASKS, state.tasks);
    renderTasks();
    updateOverviewStats();
};

// ----------------------------------------------------
// BÜTÇE (FINANCE) MODULE
// ----------------------------------------------------
function initFinancePanel() {
    const financeForm = document.getElementById('finance-form');
    const finTitle = document.getElementById('fin-title');
    const finAmount = document.getElementById('fin-amount');
    const finType = document.getElementById('fin-type');
    
    financeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTransaction = {
            id: Date.now(),
            title: finTitle.value,
            amount: parseFloat(finAmount.value),
            type: finType.value,
            date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        };
        
        state.transactions.push(newTransaction);
        saveState(KEYS.TRANSACTIONS, state.transactions);
        
        finTitle.value = '';
        finAmount.value = '';
        
        renderFinance();
        updateOverviewStats();
    });
    
    initFinancePieChart();
    renderFinance();
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

function renderFinance() {
    const ledgerBody = document.getElementById('ledger-body');
    ledgerBody.innerHTML = '';
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    state.transactions.forEach(tx => {
        if (tx.type === 'income') totalIncome += tx.amount;
        else totalExpense += tx.amount;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${tx.title}</td>
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
    
    if (state.transactions.length === 0) {
        ledgerBody.innerHTML = `<tr><td colspan="5" class="empty-msg">İşlem kaydı bulunmuyor.</td></tr>`;
    }
    
    // Update summary texts
    document.getElementById('fin-income-total').textContent = `₺${totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    document.getElementById('fin-expense-total').textContent = `₺${totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    
    // Update pie chart
    if (financePieChartInstance) {
        financePieChartInstance.data.datasets[0].data = [totalIncome, totalExpense];
        financePieChartInstance.data.datasets[0].borderColor = state.theme === 'dark' ? '#152035' : '#ffffff';
        financePieChartInstance.options.plugins.legend.labels.color = state.theme === 'dark' ? '#9ca3af' : '#64748b';
        financePieChartInstance.update();
    }
}

window.deleteTransaction = function(id) {
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
    
    newNoteBtn.addEventListener('click', () => {
        const newNote = {
            id: Date.now().toString(),
            title: 'Yeni Not',
            body: '',
            date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
        };
        
        state.notes.unshift(newNote);
        saveState(KEYS.NOTES, state.notes);
        
        state.activeNoteId = newNote.id;
        saveState(KEYS.ACTIVE_NOTE_ID, state.activeNoteId);
        
        renderNotesSidebar();
        selectNote(newNote.id);
    });
    
    deleteNoteBtn.addEventListener('click', () => {
        if (!state.activeNoteId) return;
        
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
        li.className = `note-item ${note.id === state.activeNoteId ? 'active' : ''}`;
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
}

// ----------------------------------------------------
// SETTINGS MODULE
// ----------------------------------------------------
function initSettingsPanel() {
    const settingsForm = document.getElementById('settings-form');
    const settingsUsername = document.getElementById('settings-username');
    const clearAllDataBtn = document.getElementById('clear-all-data-btn');
    
    // Init name UI
    settingsUsername.value = state.username;
    updateUsernameUI();
    
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        state.username = settingsUsername.value || 'Kullanıcı';
        saveState(KEYS.USERNAME, state.username);
        
        updateUsernameUI();
        
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
            localStorage.clear();
            
            // Reset local state
            state = {
                theme: 'dark',
                accent: '#3b82f6',
                username: 'Ege Kolatan',
                tasks: [],
                transactions: [],
                notes: [],
                quickNote: '',
                activeNoteId: null
            };
            
            // Reload page to re-initialize everything from fresh empty state
            window.location.reload();
        }
    });
}

function updateUsernameUI() {
    document.getElementById('display-username').textContent = state.username;
    document.getElementById('user-avatar-initial').textContent = state.username.charAt(0).toUpperCase();
    
    // Profil alanına tıklanınca çıkış yapma özelliği ekle
    const profile = document.querySelector('.user-profile');
    if (profile) {
        profile.style.cursor = 'pointer';
        profile.title = 'Çıkış yapmak için tıklayın';
        profile.onclick = () => {
            if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
                localStorage.removeItem('auth_crud_current_user');
                window.location.href = '../auth-crud/index.html';
            }
        };
    }
}

