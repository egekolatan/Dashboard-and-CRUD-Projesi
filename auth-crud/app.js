/**
 * KİMLİK DOĞRULAMALI ÜRÜN YÖNETİM SİSTEMİ (CRUD)
 * ---------------------------------------------
 * Bu JavaScript dosyası uygulamanın tüm mantığını yönetir.
 * localStorage kullanarak kullanıcı kayıt/giriş durumlarını kontrol eder
 * ve ürün ekleme, listeleme, güncelleme ve silme (CRUD) işlemlerini gerçekleştirir.
 */

// Tarayıcı Depolama (localStorage) Anahtarları
const STORAGE_KEYS = {
    USERS: 'auth_crud_users',               // Kayıtlı tüm kullanıcıların tutulacağı liste
    CURRENT_USER: 'auth_crud_current_user',   // Giriş yapmış olan aktif kullanıcının bilgileri
    PRODUCTS: 'auth_crud_products'           // Eklenmiş olan tüm ürünlerin tutulacağı liste
};

// API Konfigürasyonu ve İstek Yardımcısı
const API_BASE = window.location.origin.includes('3000') ? '' : 'http://localhost:3000';

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
    }
    return response.json();
}

// Uygulama Durum Yönetimi (State)
let appState = {
    users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [],
    currentUser: JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null
};

// Şifre Hashleme Yardımcı Fonksiyonu (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Varsayılan Yönetici Bilgileri Kontrolü ve Ekleme
const defaultAdmin = {
    name: 'Ege Kolatan',
    email: 'egekolatan114@gmail.com',
    password: 'Ege352008',
    avatar: 'E'
};

async function initDefaultAdmin() {
    const hashedPass = await hashPassword(defaultAdmin.password);
    const adminIndex = appState.users.findIndex(u => u.email === defaultAdmin.email);
    
    if (adminIndex === -1) {
        const adminCopy = { ...defaultAdmin, password: hashedPass };
        appState.users.push(adminCopy);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(appState.users));
    } else if (appState.users[adminIndex].password.length < 64) {
        // Eğer mevcut şifre hashlenmemişse güncelle
        appState.users[adminIndex].password = hashedPass;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(appState.users));
    }
}

// ----------------------------------------------------
// SAYFA YÜKLENDİĞİNDE BAŞLATILACAK FONKSİYONLAR
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    await initDefaultAdmin();
    checkAuthStatus();
    setupAuthEvents();
    setupPasswordToggle();
    setupResetPasswordEvents();
});

// ----------------------------------------------------
// KİMLİK DOĞRULAMA (AUTH) MANTIĞI
// ----------------------------------------------------

// Giriş durumunu kontrol eden ve ekranları açıp/kapatan fonksiyon
function checkAuthStatus() {
    if (appState.currentUser) {
        // Eğer kullanıcı giriş yapmışsa doğrudan dashboard'a yönlendir
        window.location.href = '../dashboard/';
    }
}

// Kimlik Doğrulama olaylarını kuran fonksiyon
function setupAuthEvents() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    
    // Sekmeler Arası Geçiş Mantığı
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            clearAuthAlert();
        });
        
        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
            clearAuthAlert();
        });
    }

    // Kayıt Formu Gönderme (Submit) İşlemi
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim().toLowerCase();
            const password = document.getElementById('register-password').value;
            
            // E-posta formatı ve şifre uzunluğu kontrolleri
            if (!email || !password || !name) {
                showAuthAlert('Lütfen tüm alanları doldurun.', 'error');
                return;
            }
            
            // Şifre gücü validasyonu (en az 6 karakter, harf ve rakam içermeli)
            const hasLetter = /[a-zA-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            if (password.length < 6 || !hasLetter || !hasNumber) {
                showAuthAlert('Şifreniz en az 6 karakter uzunluğunda olmalı, en az bir harf ve bir rakam içermelidir!', 'error');
                return;
            }
            
            // API Üzerinden Kayıt Denemesi
            try {
                const res = await apiFetch('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, password })
                });
                showAuthAlert(res.message || 'Kayıt başarıyla tamamlandı!', 'success');
                registerForm.reset();
                setTimeout(() => {
                    tabLogin.click();
                }, 1500);
            } catch (err) {
                console.warn("Sunucu çevrimdışı, yerel veritabanı (localStorage) kullanılıyor:", err);
                
                // Kullanıcı zaten kayıtlı mı kontrolü
                const userExists = appState.users.some(u => u.email === email);
                if (userExists) {
                    showAuthAlert('Bu e-posta adresi zaten kayıtlı!', 'error');
                    return;
                }
                
                // Yeni kullanıcıyı şifresini hashleyerek ekle
                const hashedPassword = await hashPassword(password);
                const newUser = { name, email, password: hashedPassword, avatar: name.charAt(0).toUpperCase() };
                appState.users.push(newUser);
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(appState.users));
                
                showAuthAlert('Kayıt başarıyla tamamlandı (Çevrimdışı)! Giriş yapabilirsiniz.', 'success');
                registerForm.reset();
                setTimeout(() => {
                    tabLogin.click();
                }, 1500);
            }
        });
    }
    
    // Giriş Formu Gönderme (Submit) İşlemi
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('login-remember').checked;
        
        // API Üzerinden Giriş Denemesi
        try {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            // Oturumu ve Token'ı Kaydet
            appState.currentUser = data.user;
            if (rememberMe) {
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(appState.currentUser));
                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            } else {
                sessionStorage.setItem('auth_token', data.token);
                sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(appState.currentUser));
                localStorage.removeItem('auth_token');
                localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            }
            
            // Dashboard Ayarları
            localStorage.setItem('novadash_username', data.user.name);
            localStorage.setItem('novadash_avatar', data.user.avatar);
            localStorage.setItem(data.user.email + '_novadash_username', data.user.name);
            localStorage.setItem(data.user.email + '_novadash_avatar', data.user.avatar);
            
            showAuthAlert('Giriş başarılı! Dashboard sayfasına yönlendiriliyorsunuz...', 'success');
            loginForm.reset();
            setTimeout(() => {
                window.location.href = '../dashboard/';
            }, 1500);
        } catch (err) {
            console.warn("Sunucu çevrimdışı, yerel veritabanı (localStorage) ile giriş deneniyor:", err);
            
            // Girilen şifreyi hashle
            const hashedInputPass = await hashPassword(password);
            
            // Kayıtlı kullanıcı listesinde eşleşme ara
            const user = appState.users.find(u => u.email === email && u.password === hashedInputPass);
            
            if (user) {
                // Başarılı giriş: Aktif kullanıcıyı ayarla ve kaydet
                appState.currentUser = { name: user.name, email: user.email, avatar: user.avatar || user.name.charAt(0).toUpperCase() };
                
                if (rememberMe) {
                    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(appState.currentUser));
                    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
                } else {
                    sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(appState.currentUser));
                    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
                }
                
                // Dashboard'da görüntülenecek kullanıcı adı ve avatar simgesini ayarla
                localStorage.setItem('novadash_username', user.name);
                localStorage.setItem('novadash_avatar', user.avatar || user.name.charAt(0).toUpperCase());
                localStorage.setItem(user.email + '_novadash_username', user.name);
                localStorage.setItem(user.email + '_novadash_avatar', user.avatar || user.name.charAt(0).toUpperCase());
                
                showAuthAlert('Giriş başarılı (Çevrimdışı)! Yönlendiriliyorsunuz...', 'success');
                loginForm.reset();
                setTimeout(() => {
                    window.location.href = '../dashboard/';
                }, 1500);
            } else {
                showAuthAlert('E-posta veya şifre hatalı! Erişim engellendi.', 'error');
            }
        }
    });
}


// Bildirim Mesajı Gösterme
function showAuthAlert(message, type) {
    const alertEl = document.getElementById('auth-alert');
    if (alertEl) {
        alertEl.textContent = message;
        alertEl.className = `alert-message ${type}`;
    }
}

// Bildirim Alanını Temizleme
function clearAuthAlert() {
    const alertEl = document.getElementById('auth-alert');
    if (alertEl) {
        alertEl.textContent = '';
        alertEl.className = 'alert-message';
    }
}

// Şifre Göster/Gizle Butonunu Aktif Eden Fonksiyon
function setupPasswordToggle() {
    const toggles = [
        { inputId: 'login-password', btnId: 'toggle-password' },
        { inputId: 'register-password', btnId: 'toggle-reg-password' }
    ];
    
    toggles.forEach(({ inputId, btnId }) => {
        const passwordInput = document.getElementById(inputId);
        const toggleButton = document.getElementById(btnId);
        if (!passwordInput || !toggleButton) return;
        
        toggleButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'text') {
                toggleButton.innerHTML = `
                    <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                `;
                toggleButton.setAttribute('aria-label', 'Şifreyi Gizle');
            } else {
                toggleButton.innerHTML = `
                    <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                `;
                toggleButton.setAttribute('aria-label', 'Şifreyi Göster');
            }
        });
    });
}

// ----------------------------------------------------
// ŞİFRE SIFIRLAMA (RESET PASSWORD) MANTIĞI
// ----------------------------------------------------
function setupResetPasswordEvents() {
    const forgotLink = document.getElementById('forgot-password-link');
    const resetModal = document.getElementById('reset-modal');
    const closeResetBtn = document.getElementById('close-reset-btn');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');
    const resetForm = document.getElementById('reset-password-form');
    const resetAlert = document.getElementById('reset-alert');

    if (forgotLink && resetModal) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            resetModal.style.display = 'flex';
            resetAlert.textContent = '';
            resetAlert.className = 'alert-message';
        });
    }

    const hideResetModal = () => {
        resetModal.style.display = 'none';
        resetForm.reset();
    };

    if (closeResetBtn) closeResetBtn.addEventListener('click', hideResetModal);
    if (cancelResetBtn) cancelResetBtn.addEventListener('click', hideResetModal);

    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reset-name').value.trim();
            const email = document.getElementById('reset-email').value.trim().toLowerCase();
            const newPassword = document.getElementById('reset-new-password').value;

            // Şifre gücü validasyonu (en az 6 karakter, harf ve rakam içermeli)
            const hasLetter = /[a-zA-Z]/.test(newPassword);
            const hasNumber = /[0-9]/.test(newPassword);
            if (newPassword.length < 6 || !hasLetter || !hasNumber) {
                resetAlert.textContent = 'Şifreniz en az 6 karakter uzunluğunda olmalı, en az bir harf ve bir rakam içermelidir!';
                resetAlert.className = 'alert-message error';
                return;
            }

            try {
                // API Şifre Sıfırlama
                const res = await apiFetch('/api/auth/reset-password', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, newPassword })
                });
                resetAlert.textContent = res.message || 'Şifre başarıyla güncellendi!';
                resetAlert.className = 'alert-message success';
                setTimeout(hideResetModal, 1500);
            } catch (err) {
                console.warn("Sunucu çevrimdışı, yerel sıfırlama deneniyor:", err);
                
                // LocalStorage Fallback
                const userIndex = appState.users.findIndex(u => u.email === email);
                if (userIndex === -1) {
                    resetAlert.textContent = 'E-posta adresi sistemde kayıtlı değil!';
                    resetAlert.className = 'alert-message error';
                    return;
                }
                
                if (appState.users[userIndex].name.toLowerCase() !== name.toLowerCase()) {
                    resetAlert.textContent = 'Girdiğiniz ad soyad bilgisi kayıtlı kullanıcıyla eşleşmiyor!';
                    resetAlert.className = 'alert-message error';
                    return;
                }

                const hashedPassword = await hashPassword(newPassword);
                appState.users[userIndex].password = hashedPassword;
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(appState.users));
                
                resetAlert.textContent = 'Şifre başarıyla güncellendi (Çevrimdışı)!';
                resetAlert.className = 'alert-message success';
                setTimeout(hideResetModal, 1500);
            }
        });
    }
}
