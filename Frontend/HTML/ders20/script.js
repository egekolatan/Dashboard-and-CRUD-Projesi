// =============================================
// ÜRÜN KATALOĞU
// =============================================
const urunlerKatalogu = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 74999,
        category: "teknoloji",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 2,
        name: "MacBook Pro M3",
        price: 89999,
        category: "teknoloji",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 3,
        name: "Apple Watch Series 9",
        price: 16499,
        category: "giyilebilir",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        name: "Sony WH-1000XM5",
        price: 11999,
        category: "teknoloji",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 5,
        name: "MagSafe Deri Cüzdan",
        price: 2499,
        category: "aksesuar",
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=60"
    },
    {
        id: 6,
        name: "USB-C Multiport Hub",
        price: 1899,
        category: "aksesuar",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&auto=format&fit=crop&q=60"
    }
];

// =============================================
// UYGULAMA DURUMU
// =============================================
let seciliKategori = 'hepsi';
let aramaKelimesi  = '';
let seciliSirala   = 'varsayilan';
let indirimOrani   = 0; // 0.10 → %10 indirim

// =============================================
// SAYFA YÜKLENME
// =============================================
function sayfaBaslat() {
    sepetSayacGuncelle();
    if (document.getElementById("urunler-container")) {
        urunleriListele();
    }
    if (document.getElementById("sepet-urunler-listesi")) {
        sepetiYukle();
    }
}

// Hem DOMContentLoaded hem window.onload'u dene
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sayfaBaslat);
} else {
    // DOM zaten hazır
    sayfaBaslat();
}

// =============================================
// LOCAL STORAGE YARDIMCI FONKSİYONLAR
// =============================================
function sepetiAl() {
    try {
        return JSON.parse(localStorage.getItem("sepet")) || [];
    } catch (e) {
        return [];
    }
}

function sepetiKaydet(sepet) {
    try {
        localStorage.setItem("sepet", JSON.stringify(sepet));
    } catch (e) {
        console.error("LocalStorage kaydetme hatası:", e);
    }
    sepetSayacGuncelle();
}

// =============================================
// SEPET SAYACI (NAVBAR BADGE)
// =============================================
function sepetSayacGuncelle() {
    var sayacEl = document.getElementById("sepet-sayac");
    if (!sayacEl) return;

    var sepet = sepetiAl();
    var toplam = 0;
    for (var i = 0; i < sepet.length; i++) {
        toplam += sepet[i].quantity;
    }
    sayacEl.textContent = toplam;

    // Badge zıplama animasyonu
    sayacEl.classList.remove("cart-bounce-anim");
    void sayacEl.offsetWidth;
    sayacEl.classList.add("cart-bounce-anim");
}

// =============================================
// ÜRÜN SEPETE EKLE
// =============================================
function sepeteEkle(urunId) {
    // Ürünü katalogdan bul
    var urun = null;
    for (var i = 0; i < urunlerKatalogu.length; i++) {
        if (urunlerKatalogu[i].id === urunId) {
            urun = urunlerKatalogu[i];
            break;
        }
    }
    if (!urun) return;

    var sepet = sepetiAl();

    // Ürün zaten sepette var mı?
    var mevcutIdx = -1;
    for (var j = 0; j < sepet.length; j++) {
        if (sepet[j].id === urunId) {
            mevcutIdx = j;
            break;
        }
    }

    if (mevcutIdx > -1) {
        sepet[mevcutIdx].quantity += 1;
    } else {
        sepet.push({
            id:       urun.id,
            name:     urun.name,
            price:    urun.price,
            image:    urun.image,
            category: urun.category,
            quantity: 1
        });
    }

    sepetiKaydet(sepet);
    bildirimGoster();
}

// =============================================
// BİLDİRİM GÖSTERİCİ
// =============================================
function bildirimGoster() {
    var kutu = document.getElementById("bildirim-kutusu");
    if (kutu) {
        kutu.style.display = "block";
        setTimeout(function () {
            kutu.style.display = "none";
        }, 2000);
        return;
    }
    // Fallback: Bootstrap Toast dene
    try {
        var toastEl = document.getElementById("bildirim-toast");
        if (toastEl && typeof bootstrap !== "undefined") {
            new bootstrap.Toast(toastEl, { delay: 2000 }).show();
        }
    } catch (e) { /* yoksay */ }
}

// =============================================
// ÜRÜN KATALOĞU LİSTELE
// =============================================
function urunleriListele() {
    var container = document.getElementById("urunler-container");
    if (!container) return;

    // Filtrele
    var liste = urunlerKatalogu.filter(function (urun) {
        var katEslesiyor = seciliKategori === 'hepsi' || urun.category === seciliKategori;
        var araEslesiyor = urun.name.toLowerCase().indexOf(aramaKelimesi.toLowerCase()) > -1 ||
                           urun.category.toLowerCase().indexOf(aramaKelimesi.toLowerCase()) > -1;
        return katEslesiyor && araEslesiyor;
    });

    // Sırala
    if (seciliSirala === 'fiyat-artan') {
        liste.sort(function (a, b) { return a.price - b.price; });
    } else if (seciliSirala === 'fiyat-azalan') {
        liste.sort(function (a, b) { return b.price - a.price; });
    } else if (seciliSirala === 'puan-azalan') {
        liste.sort(function (a, b) { return b.rating - a.rating; });
    }

    if (liste.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><i class="fa-solid fa-face-frown text-muted fs-1 mb-3"></i><h4 class="text-muted">Aramanızla eşleşen ürün bulunamadı.</h4></div>';
        return;
    }

    var html = '';
    for (var k = 0; k < liste.length; k++) {
        var urun = liste[k];
        html += urunKartiOlustur(urun);
    }
    container.innerHTML = html;
}

function urunKartiOlustur(urun) {
    // Yıldız oluştur
    var yildizHtml = '';
    var tam = Math.floor(urun.rating);
    var yarim = (urun.rating % 1) !== 0;
    for (var i = 1; i <= 5; i++) {
        if (i <= tam) {
            yildizHtml += '<i class="fa-solid fa-star text-warning me-1"></i>';
        } else if (i === tam + 1 && yarim) {
            yildizHtml += '<i class="fa-solid fa-star-half-stroke text-warning me-1"></i>';
        } else {
            yildizHtml += '<i class="fa-regular fa-star text-secondary opacity-50 me-1"></i>';
        }
    }

    var fiyat = urun.price.toLocaleString('tr-TR');

    return '<div class="col-12 col-md-6 col-lg-4">' +
        '<div class="product-card">' +
            '<div class="product-image-container">' +
                '<span class="category-badge">' + urun.category.toUpperCase() + '</span>' +
                '<img src="' + urun.image + '" alt="' + urun.name + '" class="product-image">' +
            '</div>' +
            '<div class="card-body p-4 d-flex flex-column justify-content-between flex-grow-1">' +
                '<div>' +
                    '<div class="small text-muted d-flex align-items-center mb-2">' +
                        yildizHtml +
                        '<span class="ms-2 fw-semibold text-dark">' + urun.rating + '</span>' +
                    '</div>' +
                    '<h5 class="fw-bold mb-2 text-dark">' + urun.name + '</h5>' +
                '</div>' +
                '<div class="mt-4">' +
                    '<div class="d-flex justify-content-between align-items-center">' +
                        '<span class="fs-4 fw-bold text-primary">₺' + fiyat + '</span>' +
                        '<button class="btn btn-add-cart d-flex align-items-center gap-2" onclick="sepeteEkle(' + urun.id + ')">' +
                            '<i class="fa-solid fa-cart-plus"></i> Sepete Ekle' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// =============================================
// FİLTRE / ARAMA / SIRALAMA
// =============================================
function kategoriFiltrele(kategori, clickedBtn) {
    seciliKategori = kategori;
    var butolar = document.querySelectorAll("#kategori-filtreleri .filter-btn");
    for (var i = 0; i < butolar.length; i++) {
        butolar[i].classList.remove("active");
    }
    if (clickedBtn) clickedBtn.classList.add("active");
    urunleriListele();
}

function urunleriAra() {
    var el = document.getElementById("arama-input");
    if (el) aramaKelimesi = el.value;
    urunleriListele();
}

function urunleriSirala() {
    var el = document.getElementById("sirala-select");
    if (el) seciliSirala = el.value;
    urunleriListele();
}

// =============================================
// SEPETİ YÜKLE (sepet.html sayfası)
// =============================================
function sepetiYukle() {
    var listeCont = document.getElementById("sepet-urunler-listesi");
    if (!listeCont) return;

    var sepet = sepetiAl();

    if (sepet.length === 0) {
        listeCont.innerHTML =
            '<div class="text-center py-5">' +
                '<div class="mb-4"><i class="fa-solid fa-basket-shopping text-muted opacity-50" style="font-size:5rem"></i></div>' +
                '<h4 class="fw-bold mb-2">Sepetiniz Boş Görünüyor</h4>' +
                '<p class="text-muted mb-4">Henüz sepetinize bir ürün eklemediniz.</p>' +
                '<a href="index.html" class="btn btn-primary rounded-pill px-5 py-3 fw-bold">' +
                    '<i class="fa-solid fa-bag-shopping me-2"></i>Alışverişe Başla' +
                '</a>' +
            '</div>';
        sepetHesaplamalariniGuncelle();
        return;
    }

    var baslik =
        '<div class="d-none d-md-flex fw-bold text-muted border-bottom pb-3 mb-3 px-3">' +
            '<div class="col-md-6">Ürün</div>' +
            '<div class="col-md-2 text-center">Fiyat</div>' +
            '<div class="col-md-2 text-center">Miktar</div>' +
            '<div class="col-md-2 text-end">Toplam</div>' +
        '</div>';

    var satirlar = '';
    for (var i = 0; i < sepet.length; i++) {
        var item = sepet[i];
        var itemToplam = (item.price * item.quantity).toLocaleString('tr-TR');
        var birimFiyat = item.price.toLocaleString('tr-TR');

        satirlar +=
            '<div class="row cart-item-row px-3 align-items-center">' +
                '<div class="col-12 col-md-6 d-flex align-items-center mb-3 mb-md-0">' +
                    '<img src="' + item.image + '" alt="' + item.name + '" class="rounded-3 me-3" style="width:70px;height:70px;object-fit:cover;border:1px solid #f1f5f9">' +
                    '<div>' +
                        '<h6 class="fw-bold mb-1 text-dark">' + item.name + '</h6>' +
                        '<span class="badge bg-light text-primary border small">' + item.category.toUpperCase() + '</span>' +
                        '<div class="d-md-none mt-2">' +
                            '<button class="btn btn-link text-danger p-0 border-0 small fw-semibold" onclick="sepettenSil(' + item.id + ')">' +
                                '<i class="fa-regular fa-trash-can me-1"></i>Kaldır' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="col-4 col-md-2 text-center">' +
                    '<span class="fw-semibold text-secondary">₺' + birimFiyat + '</span>' +
                '</div>' +
                '<div class="col-4 col-md-2 d-flex justify-content-center align-items-center">' +
                    '<div class="d-flex align-items-center gap-2">' +
                        '<button class="quantity-btn" onclick="miktarDegistir(' + item.id + ', -1)">' +
                            '<i class="fa-solid fa-minus" style="font-size:0.7rem"></i>' +
                        '</button>' +
                        '<span class="fw-bold px-2 text-dark" style="min-width:20px;text-align:center">' + item.quantity + '</span>' +
                        '<button class="quantity-btn" onclick="miktarDegistir(' + item.id + ', 1)">' +
                            '<i class="fa-solid fa-plus" style="font-size:0.7rem"></i>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="col-4 col-md-2 d-flex align-items-center justify-content-end gap-3">' +
                    '<span class="fw-bold text-primary">₺' + itemToplam + '</span>' +
                    '<button class="btn btn-light text-danger rounded-circle p-2 d-none d-md-flex align-items-center justify-content-center shadow-sm" style="width:36px;height:36px" onclick="sepettenSil(' + item.id + ')">' +
                        '<i class="fa-solid fa-trash-can" style="font-size:0.75rem"></i>' +
                    '</button>' +
                '</div>' +
            '</div>';
    }

    listeCont.innerHTML = baslik + '<div>' + satirlar + '</div>';
    sepetHesaplamalariniGuncelle();
}

// =============================================
// MİKTAR GÜNCELLE
// =============================================
function miktarDegistir(urunId, deger) {
    var sepet = sepetiAl();
    for (var i = 0; i < sepet.length; i++) {
        if (sepet[i].id === urunId) {
            sepet[i].quantity += deger;
            if (sepet[i].quantity <= 0) {
                sepet.splice(i, 1);
            }
            break;
        }
    }
    sepetiKaydet(sepet);
    sepetiYukle();
}

// =============================================
// ÜRÜNDEN SİL
// =============================================
function sepettenSil(urunId) {
    var sepet = sepetiAl().filter(function (item) {
        return item.id !== urunId;
    });
    sepetiKaydet(sepet);
    sepetiYukle();
}

// =============================================
// HESAPLAMALAR GÜNCELLE
// =============================================
function sepetHesaplamalariniGuncelle() {
    var sepet = sepetiAl();

    var araToplam = 0;
    var toplamAdet = 0;
    for (var i = 0; i < sepet.length; i++) {
        araToplam += sepet[i].price * sepet[i].quantity;
        toplamAdet += sepet[i].quantity;
    }

    var kargo = (sepet.length === 0) ? 0 : (araToplam > 500 ? 0 : 29.90);
    var indirim = araToplam * indirimOrani;
    var toplam = araToplam + kargo - indirim;

    var araEl = document.getElementById("sepet-ara-toplam");
    if (araEl) araEl.textContent = '₺' + araToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 });

    var kargoEl = document.getElementById("sepet-kargo");
    if (kargoEl) kargoEl.textContent = kargo === 0 ? 'Ücretsiz' : '₺' + kargo.toFixed(2);

    var indirimSatiri = document.getElementById("indirim-satiri");
    var indirimEl = document.getElementById("sepet-indirim");
    if (indirimSatiri && indirimEl) {
        if (indirimOrani > 0 && sepet.length > 0) {
            indirimSatiri.classList.remove("d-none");
            indirimEl.textContent = '-₺' + indirim.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
        } else {
            indirimSatiri.classList.add("d-none");
        }
    }

    var toplamEl = document.getElementById("sepet-toplam");
    if (toplamEl) toplamEl.textContent = '₺' + toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 });

    var ozetEl = document.getElementById("sepet-ozet-yazi");
    if (ozetEl) {
        ozetEl.textContent = sepet.length === 0
            ? 'Sepetinizde ürün bulunmamaktadır.'
            : 'Sepetinizde ' + toplamAdet + ' adet ürün bulunmaktadır.';
    }
}

// =============================================
// KUPON UYGULA
// =============================================
function kuponUygula() {
    var inputEl  = document.getElementById("kupon-kodu");
    var mesajEl  = document.getElementById("kupon-mesaj");
    if (!inputEl || !mesajEl) return;

    var sepet = sepetiAl();
    if (sepet.length === 0) {
        mesajEl.className = "small mt-2 text-danger";
        mesajEl.textContent = "Sepetiniz boş olduğu için kupon uygulanamaz.";
        return;
    }

    var kod = inputEl.value.trim().toUpperCase();
    if (kod === "KART10") {
        indirimOrani = 0.10;
        mesajEl.className = "small mt-2 text-success fw-semibold";
        mesajEl.textContent = "✓ Kupon uygulandı! %10 indirim kazandınız.";
    } else if (kod === "") {
        mesajEl.className = "small mt-2 text-danger";
        mesajEl.textContent = "Lütfen geçerli bir kupon kodu girin.";
    } else {
        indirimOrani = 0;
        mesajEl.className = "small mt-2 text-danger";
        mesajEl.textContent = "Geçersiz kupon kodu.";
    }
    sepetHesaplamalariniGuncelle();
}

// =============================================
// ÖDEMEYİ TAMAMLA
// =============================================
function sepetiTamamla() {
    var sepet = sepetiAl();
    if (sepet.length === 0) {
        alert("Sepetiniz boş olduğu için ödemeye geçilemez.");
        return;
    }

    var araToplam = 0;
    for (var i = 0; i < sepet.length; i++) {
        araToplam += sepet[i].price * sepet[i].quantity;
    }
    var kargo   = araToplam > 500 ? 0 : 29.90;
    var indirim = araToplam * indirimOrani;
    var toplam  = araToplam + kargo - indirim;

    var odenenEl = document.getElementById("siparis-odenen-tutar");
    if (odenenEl) odenenEl.textContent = '₺' + toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 });

    var siparisKoduEl = document.getElementById("siparis-kodu");
    if (siparisKoduEl) siparisKoduEl.textContent = '#ATC' + Math.floor(100000 + Math.random() * 900000);

    try {
        var modalEl = document.getElementById("checkoutModal");
        if (modalEl && typeof bootstrap !== "undefined") {
            new bootstrap.Modal(modalEl).show();
        }
    } catch (e) {
        // Bootstrap Modal yüklü değilse
        alert("Siparişiniz alındı! Toplam: ₺" + toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 }));
        siparisKapat();
    }
}

// =============================================
// MODAL KAPAT & SEPETE TEMIZLE
// =============================================
function siparisKapat() {
    try {
        localStorage.removeItem("sepet");
    } catch (e) {}
    indirimOrani = 0;

    try {
        var modalEl = document.getElementById("checkoutModal");
        if (modalEl && typeof bootstrap !== "undefined") {
            var instance = bootstrap.Modal.getInstance(modalEl);
            if (instance) instance.hide();
        }
    } catch (e) {}

    window.location.href = "index.html";
}