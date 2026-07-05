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

// Uygulama Durum Yönetimi (State)
let appState = {
    users: JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [],
    currentUser: JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null,
    products: [] // DOMContentLoaded aşamasında initProducts() ile doldurulacak
};

// Varsayılan Yönetici Bilgileri Kontrolü ve Ekleme
const defaultAdmin = {
    name: 'Ege Kolatan',
    email: 'egekolatan114@gmail.com',
    password: 'Ege352008'
};

if (!appState.users.some(u => u.email === defaultAdmin.email)) {
    appState.users.push(defaultAdmin);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(appState.users));
}

// Ürünleri Güvenli Yükleme Fonksiyonu
function initProducts() {
    try {
        const rawData = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        appState.products = rawData ? JSON.parse(rawData) : [];
    } catch (e) {
        console.error("Ürün verileri okunurken hata oluştu, sıfırlanıyor...", e);
        appState.products = [];
    }
}

// ----------------------------------------------------
// SAYFA YÜKLENDİĞİNDE BAŞLATILACAK FONKSİYONLAR
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    checkAuthStatus();
    setupAuthEvents();
    setupPasswordToggle();
    setupCrudEvents();
    setupDataActions();
});

// ----------------------------------------------------
// KİMLİK DOĞRULAMA (AUTH) MANTIĞI
// ----------------------------------------------------

// Giriş durumunu kontrol eden ve ekranları açıp/kapatan fonksiyon
function checkAuthStatus() {
    const authSection = document.getElementById('auth-section');
    const appSection = document.getElementById('app-section');
    
    if (appState.currentUser) {
        // Eğer kullanıcı giriş yapmışsa: Formu gizle, ana ekranı göster
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        document.getElementById('user-display-name').textContent = appState.currentUser.name;
        renderProducts(); // Ürün tablosunu ekrana çiz
    } else {
        // Giriş yapılmamışsa: Giriş formunu göster, ana ekranı gizle
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
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
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim().toLowerCase();
            const password = document.getElementById('register-password').value;
            
            // E-posta formatı ve şifre uzunluğu kontrolleri
            if (!email || !password || !name) {
                showAuthAlert('Lütfen tüm alanları doldurun.', 'error');
                return;
            }
            
            // Kullanıcı zaten kayıtlı mı kontrolü
            const userExists = appState.users.some(u => u.email === email);
            if (userExists) {
                showAuthAlert('Bu e-posta adresi zaten kayıtlı!', 'error');
                return;
            }
            
            // Yeni kullanıcıyı ekle
            const newUser = { name, email, password };
            appState.users.push(newUser);
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(appState.users));
            
            showAuthAlert('Kayıt başarıyla tamamlandı! Giriş yapabilirsiniz.', 'success');
            registerForm.reset();
            
            // Giriş sekmesine otomatik geçiş yap
            setTimeout(() => {
                tabLogin.click();
            }, 1500);
        });
    }
    
    // Giriş Formu Gönderme (Submit) İşlemi
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        
        // Kayıtlı kullanıcı listesinde eşleşme ara
        const user = appState.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Başarılı giriş: Aktif kullanıcıyı ayarla ve kaydet
            appState.currentUser = { name: user.name, email: user.email };
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(appState.currentUser));
            
            // Dashboard'da görüntülenecek kullanıcı adı ve avatar simgesini ayarla
            localStorage.setItem('novadash_username', user.name);
            localStorage.setItem('novadash_avatar', user.name.charAt(0).toUpperCase());
            
            showAuthAlert('Giriş başarılı! Dashboard sayfasına yönlendiriliyorsunuz...', 'success');
            loginForm.reset();
            
            // 1.5 saniye sonra dashboard sayfasına yönlendir
            setTimeout(() => {
                window.location.href = '../dashboard/';
            }, 1500);
        } else {
            // Hatalı giriş: Hata mesajı göster
            showAuthAlert('E-posta veya şifre hatalı! Erişim engellendi.', 'error');
        }
    });
    
    // Çıkış Yapma İşlemi
    document.getElementById('logout-btn').addEventListener('click', () => {
        appState.currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        checkAuthStatus();
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
// CRUD (ÜRETİM & ENVANTER YÖNETİMİ) MANTIĞI
// ----------------------------------------------------
function setupCrudEvents() {
    const productForm = document.getElementById('product-form');
    const searchInput = document.getElementById('search-input');
    const filterCategory = document.getElementById('filter-category');
    
    // Yeni Ürün Ekleme (Create)
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('prod-name').value.trim();
        const category = document.getElementById('prod-category').value;
        const price = parseFloat(document.getElementById('prod-price').value);
        const stock = parseInt(document.getElementById('prod-stock').value);
        
        const newProduct = {
            id: Date.now().toString(), // Benzersiz ID üretme
            name,
            category,
            price,
            stock,
            createdBy: appState.currentUser.name, // Ürünü ekleyen kullanıcı bilgisi
            creatorEmail: appState.currentUser.email
        };
        
        appState.products.push(newProduct);
        saveProducts();
        renderProducts();
        
        productForm.reset();
    });
    
    // Arama Kutusuna Göre Canlı Filtreleme
    searchInput.addEventListener('input', renderProducts);
    
    // Kategoriye Göre Canlı Filtreleme
    filterCategory.addEventListener('change', renderProducts);
    
    // Modal Düzenleme Formu Gönderme (Update)
    const editProductForm = document.getElementById('edit-product-form');
    editProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('edit-prod-id').value;
        const name = document.getElementById('edit-prod-name').value.trim();
        const category = document.getElementById('edit-prod-category').value;
        const price = parseFloat(document.getElementById('edit-prod-price').value);
        const stock = parseInt(document.getElementById('edit-prod-stock').value);
        
        // Ürünü listede bulup güncelleme
        appState.products = appState.products.map(prod => {
            if (prod.id === id) {
                return { ...prod, name, category, price, stock };
            }
            return prod;
        });
        
        saveProducts();
        renderProducts();
        closeModal();
    });
    
    // Modal Kapatma Düğmeleri
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
}

// Ürünleri localStorage'a Kaydetme
function saveProducts() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(appState.products));
}

// Ürünleri Listeleme / Tabloyu Güncelleme (Read)
function renderProducts() {
    const tableBody = document.getElementById('product-table-body');
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    
    tableBody.innerHTML = '';
    
    // Arama kriterine ve kategoriye göre filtreleme
    const filteredProducts = appState.products.filter(prod => {
        const matchesSearch = prod.name.toLowerCase().includes(searchQuery);
        const matchesCategory = categoryFilter === 'Hepsi' || prod.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    // Envanter boşsa bildirim satırı bas
    if (filteredProducts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-row-msg">Gösterilecek ürün kaydı bulunmuyor.</td>
            </tr>
        `;
        return;
    }
    
    // Tablo satırlarını oluşturma
    filteredProducts.forEach(prod => {
        const tr = document.createElement('tr');
        
        // Çöp kutusu ve kalem simgeleri için basit butonlar
        // Ürünü yalnızca ekleyen kişi düzenleyebilir/silebilir
        const isOwner = prod.creatorEmail === appState.currentUser.email;
        
        tr.innerHTML = `
            <td><strong>${escapeHtml(prod.name)}</strong></td>
            <td>${escapeHtml(prod.category)}</td>
            <td>₺${prod.price.toFixed(2)}</td>
            <td>${prod.stock} adet</td>
            <td><span class="text-muted">${escapeHtml(prod.createdBy)}</span></td>
            <td>
                <div class="table-actions">
                    ${isOwner ? `
                        <button class="btn-icon" onclick="openEditModal('${prod.id}')" title="Düzenle">✏️</button>
                        <button class="btn-icon" onclick="deleteProduct('${prod.id}')" title="Sil">🗑️</button>
                    ` : '<span class="text-muted" style="font-size:0.8rem">Kısıtlı</span>'}
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Güvenli HTML Temizliği (XSS Koruması)
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Ürün Silme Fonksiyonu (Delete)
window.deleteProduct = function(id) {
    const product = appState.products.find(p => p.id === id);
    if (!product) return;
    
    // Güvenlik amaçlı onay kutusu
    if (confirm(`"${product.name}" isimli ürünü silmek istediğinizden emin misiniz?`)) {
        appState.products = appState.products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
    }
};

// Düzenleme Modalini Açma ve Verileri Doldurma (Update Aşaması 1)
window.openEditModal = function(id) {
    const product = appState.products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('edit-prod-id').value = product.id;
    document.getElementById('edit-prod-name').value = product.name;
    document.getElementById('edit-prod-category').value = product.category;
    document.getElementById('edit-prod-price').value = product.price;
    document.getElementById('edit-prod-stock').value = product.stock;
    
    document.getElementById('edit-modal').classList.add('active');
};

// Modali Kapatma
function closeModal() {
    document.getElementById('edit-modal').classList.remove('active');
    document.getElementById('edit-product-form').reset();
}

// ----------------------------------------------------
// VERİ ÇEKME / DIŞA AKTAR - İÇE AKTAR (EXPORT/IMPORT) MANTIĞI
// ----------------------------------------------------
function setupDataActions() {
    const exportBtn = document.getElementById('export-json-btn');
    const importFile = document.getElementById('import-file');
    
    // Verileri JSON Olarak Dışa Aktar (Download)
    exportBtn.addEventListener('click', () => {
        if (appState.products.length === 0) {
            alert('Dışa aktarılacak hiç ürün verisi yok!');
            return;
        }
        
        // JSON dizesini biçimlendirerek oluştur
        const dataStr = JSON.stringify(appState.products, null, 2);
        
        // İndirme işlemini tetiklemek için sanal bir indirme bağlantısı (link) kur
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `stok_envanteri_${Date.now()}.json`; // Dosya adı şablonu
        document.body.appendChild(a);
        a.click();
        
        // Temizlik işlemleri
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // JSON Dosyası Yükleme (İçe Aktar)
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const importedData = JSON.parse(evt.target.result);
                
                // Gelen verinin basit bir şema kontrolü
                if (Array.isArray(importedData)) {
                    // Mevcut ürün listesiyle birleştirme veya tamamen üzerine yazma seçeneği
                    if (confirm('İçe aktarılan ürünleri mevcut listenizin üzerine yazmak ister misiniz? (Hayır derseniz listenin sonuna eklenir)')) {
                        appState.products = importedData;
                    } else {
                        appState.products = [...appState.products, ...importedData];
                    }
                    
                    saveProducts();
                    renderProducts();
                    alert('Veriler başarıyla içe aktarıldı!');
                } else {
                    alert('Geçersiz dosya formatı! JSON verisi bir dizi (array) olmalıdır.');
                }
            } catch (err) {
                alert('Dosya okunurken bir hata oluştu: ' + err.message);
            }
            
            // Aynı dosyayı tekrar yükleyebilmek için input alanını sıfırla
            importFile.value = '';
        };
        
        reader.readAsText(file);
    });
}
