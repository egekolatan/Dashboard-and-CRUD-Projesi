import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CategorySidebar from './components/CategorySidebar';
import ProductCard from './components/ProductCard';
import CustomizeModal from './components/CustomizeModal';
import CartDrawer from './components/CartDrawer';
import StoreLocator from './components/StoreLocator';
import LoginModal from './components/LoginModal';
import ProfileDashboard from './components/ProfileDashboard';
import PaymentModal from './components/PaymentModal';
import MobileMenu from './components/MobileMenu';
import OrderTracker from './components/OrderTracker';
import { translations } from './services/translations';
import { simulatedLogin, simulatedRegister, simulatedAddBalance, simulatedCheckout } from './services/api';
import { Search } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'Tüm Menü' },
  { id: 'hot-coffee', name: 'Sıcak Kahveler' },
  { id: 'cold-coffee', name: 'Soğuk Kahveler' },
  { id: 'matcha', name: 'Matcha Bölümü' },
  { id: 'frappuccino', name: 'Frappuccino®' },
  { id: 'tea', name: 'Sıcak & Soğuk Çaylar' },
  { id: 'bakery', name: 'Fırından & Yiyecek' }
];

const PRODUCTS = [
  // Hot Coffees - Increased Prices
  {
    id: 1,
    category: 'hot-coffee',
    name: 'Caffè Latte',
    description: 'Zengin espresso, taze süt ve üzerinde ince bir süt köpüğü katmanının mükemmel uyumu.',
    price: 135.00,
    calories: 220,
    type: 'hot',
    color: '#7f5a44',
    defaultShots: 2,
    hasMilk: true,
    isNew: false
  },
  {
    id: 2,
    category: 'hot-coffee',
    name: 'Caffè Mocha',
    description: 'Espresso, mocha sosu (çikolata) ve buharlanmış sütün, çırpılmış krema ile buluşması.',
    price: 155.00,
    calories: 360,
    type: 'hot',
    color: '#4e2d1d',
    defaultShots: 2,
    hasMilk: true,
    isNew: false
  },
  {
    id: 3,
    category: 'hot-coffee',
    name: 'Caramel Macchiato',
    description: 'Vanilya şurubu, sıcak süt ve süt köpüğünün üzerine eklenen espresso ve özel karamel sosu.',
    price: 150.00,
    calories: 250,
    type: 'hot',
    color: '#cba258',
    defaultShots: 2,
    hasMilk: true,
    isNew: true
  },
  {
    id: 4,
    category: 'hot-coffee',
    name: 'Caffè Americano',
    description: 'Sıcak su ile inceltilmiş zengin espresso lezzeti.',
    price: 115.00,
    calories: 15,
    type: 'hot',
    color: '#1a100c',
    defaultShots: 2,
    hasMilk: false,
    isNew: false
  },
  {
    id: 5,
    category: 'hot-coffee',
    name: 'Filtre Kahve',
    description: 'Günün özenle seçilmiş kahve çekirdeklerinden demlenmiş klasik filtre kahve.',
    price: 105.00,
    calories: 5,
    type: 'hot',
    color: '#321f16',
    defaultShots: 0,
    hasMilk: false,
    isNew: false
  },

  // Cold Coffees - Increased Prices
  {
    id: 6,
    category: 'cold-coffee',
    name: 'Iced Caffè Latte',
    description: 'Buz, soğuk süt ve zengin espressonun serinletici buluşması.',
    price: 140.00,
    calories: 130,
    type: 'cold',
    color: '#a18276',
    defaultShots: 2,
    hasMilk: true,
    isNew: false
  },
  {
    id: 7,
    category: 'cold-coffee',
    name: 'Iced Caramel Macchiato',
    description: 'Buzlu süt ve vanilya şurubu karışımının üzerine espresso ve karamel sosu gezdirilmesi.',
    price: 160.00,
    calories: 250,
    type: 'cold',
    color: '#e5c185',
    defaultShots: 2,
    hasMilk: true,
    isNew: false
  },
  {
    id: 8,
    category: 'cold-coffee',
    name: 'Cold Brew',
    description: 'İri çekilmiş kahve çekirdeklerinin soğuk suda 20 saat demlenmesiyle elde edilen pürüzsüz sertlik.',
    price: 145.00,
    calories: 5,
    type: 'cold',
    color: '#0e0907',
    defaultShots: 0,
    hasMilk: false,
    isNew: true
  },

  // Matcha Section [NEW]
  {
    id: 20,
    category: 'matcha',
    name: 'Sıcak Matcha Latte',
    description: 'Yüksek kaliteli Japon Matcha yeşil çayı ile sıcak buharlanmış sütün pürüzsüz buluşması.',
    price: 145.00,
    calories: 190,
    type: 'hot',
    color: '#689f38',
    defaultShots: 0,
    hasMilk: true,
    isNew: true
  },
  {
    id: 21,
    category: 'matcha',
    name: 'Buzlu Matcha Latte',
    description: 'Matcha yeşil çayı, soğuk süt ve buz küplerinin ferahlatıcı kombinasyonu.',
    price: 150.00,
    calories: 140,
    type: 'cold',
    color: '#8bc34a',
    defaultShots: 0,
    hasMilk: true,
    isNew: false
  },
  {
    id: 22,
    category: 'matcha',
    name: 'Matcha Dilim Kek',
    description: 'Matcha çayı ile fırınlanmış, hafif krema dolgulu yeşil renkli özel dilim kek.',
    price: 110.00,
    calories: 310,
    type: 'bakery',
    color: '#7cb342',
    defaultShots: 0,
    hasMilk: false,
    isNew: true
  },

  // Frappuccinos
  {
    id: 9,
    category: 'frappuccino',
    name: 'Caramel Frappuccino®',
    description: 'Kahve, süt, buz ve karamel şurubunun blenderda çekilip çırpılmış krema ve karamel sosuyla sunumu.',
    price: 165.00,
    calories: 380,
    type: 'frappuccino',
    color: '#dbad6a',
    defaultShots: 1,
    hasMilk: true,
    isNew: false
  },
  {
    id: 10,
    category: 'frappuccino',
    name: 'Java Chip Frappuccino®',
    description: 'Kahve, süt, buz, çikolatalı kurabiye parçacıkları ve mocha sosunun eşsiz uyumu.',
    price: 170.00,
    calories: 440,
    type: 'frappuccino',
    color: '#3d2b20',
    defaultShots: 1,
    hasMilk: true,
    isNew: false
  },
  {
    id: 11,
    category: 'frappuccino',
    name: 'Matcha Green Tea Cream Frappuccino®',
    description: 'İnce çekilmiş Matcha yeşil çayı, süt ve buzun krema sosu eşliğindeki ferahlatıcı dansı.',
    price: 175.00,
    calories: 410,
    type: 'frappuccino',
    color: '#86b07c',
    defaultShots: 0,
    hasMilk: true,
    isNew: true
  },

  // Teas
  {
    id: 12,
    category: 'tea',
    name: 'Chai Tea Latte',
    description: 'Siyah çay, zencefil, tarçın, karanfil gibi baharatlar ile buharlanmış sütün kremsi uyumu.',
    price: 140.00,
    calories: 240,
    type: 'tea',
    color: '#ca9a70',
    defaultShots: 0,
    hasMilk: true,
    isNew: false
  },
  {
    id: 13,
    category: 'tea',
    name: 'Earl Grey Black Tea',
    description: 'Bergamot aromalı geleneksel kaliteli siyah çay yaprakları.',
    price: 85.00,
    calories: 0,
    type: 'tea',
    color: '#a13e20',
    defaultShots: 0,
    hasMilk: false,
    isNew: false
  },

  // Bakery & Food [DIVERSIFIED]
  {
    id: 14,
    category: 'bakery',
    name: 'Tereyağlı Kruvasan',
    description: 'Fransız usulü kat kat tereyağlı lezzetli taze kruvasan.',
    price: 90.00,
    calories: 270,
    type: 'bakery',
    color: '#e5a65d',
    defaultShots: 0,
    hasMilk: false,
    isNew: false
  },
  {
    id: 15,
    category: 'bakery',
    name: 'Belçika Çikolatalı Kurabiye',
    description: 'Dışı kıtır içi yumuşacık, bol miktarda Belçika çikolatası içeren dev kurabiye.',
    price: 80.00,
    calories: 330,
    type: 'bakery',
    color: '#653e1b',
    defaultShots: 0,
    hasMilk: false,
    isNew: true
  },
  {
    id: 25,
    category: 'bakery',
    name: 'San Sebastian Cheesecake',
    description: 'Yumuşak kıvamlı, üzeri karamelize yanık dokulu nefis İspanyol cheesecake.',
    price: 160.00,
    calories: 420,
    type: 'bakery',
    color: '#e5c185',
    defaultShots: 0,
    hasMilk: false,
    isNew: true
  },
  {
    id: 26,
    category: 'bakery',
    name: 'Vişneli Çikolatalı Muffin',
    description: 'İçi vişne dolgulu ve üzerinde çikolata parçaları olan yumuşak muffin kek.',
    price: 95.00,
    calories: 290,
    type: 'bakery',
    color: '#8d6e63',
    defaultShots: 0,
    hasMilk: false,
    isNew: false
  },
  {
    id: 27,
    category: 'bakery',
    name: 'Tomato & Mozzarella Focaccia',
    description: 'Kurutulmuş domates, mozzarella peyniri ve enfes fesleğen soslu İtalyan focaccia ekmeği sandviçi.',
    price: 150.00,
    calories: 380,
    type: 'bakery',
    color: '#d7ccc8',
    defaultShots: 0,
    hasMilk: false,
    isNew: false
  },
  {
    id: 28,
    category: 'bakery',
    name: 'İzmir Boyozu & Simit Tabağı',
    description: 'Klasik İzmir boyozu ve çıtır sokak simidi, zeytin ve süzme peynir eşliğinde.',
    price: 90.00,
    calories: 340,
    type: 'bakery',
    color: '#e5a65d',
    defaultShots: 0,
    hasMilk: false,
    isNew: true
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // menu, rewards, gift
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginInitialMode, setLoginInitialMode] = useState('login');

  const [lang, setLang] = useState('tr');
  const [activeOrder, setActiveOrder] = useState(null);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [apiLoading, setApiLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingAddAmount, setPendingAddAmount] = useState(0);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  React.useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const [users, setUsers] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('kolatan_users') || '[]');
    const defaultUser = {
      name: 'Ege Kolatan',
      email: 'egekolatan114@gmail.com',
      password: 'ege352008',
      username: 'egekolatan',
      avatar: '☕',
      balance: 250.00,
      stars: 5
    };
    const filtered = saved.filter(u => u.email !== 'egekolatan114@gmail.com');
    const updated = [...filtered, defaultUser];
    localStorage.setItem('kolatan_users', JSON.stringify(updated));
    return updated;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('kolatan_current_user') || 'null');
  });

  const [orderHistory, setOrderHistory] = useState([]);

  React.useEffect(() => {
    if (currentUser) {
      const orders = JSON.parse(localStorage.getItem(currentUser.email + '_orders') || '[]');
      setOrderHistory(orders);
      
      const freshUser = users.find(u => u.email === currentUser.email);
      if (freshUser) {
        if (freshUser.balance !== currentUser.balance || freshUser.stars !== currentUser.stars || freshUser.avatar !== currentUser.avatar || freshUser.username !== currentUser.username) {
          setCurrentUser(freshUser);
          localStorage.setItem('kolatan_current_user', JSON.stringify(freshUser));
        }
      }
    } else {
      setOrderHistory([]);
    }
  }, [currentUser, users]);

  const handleLogin = async (email, password) => {
    setApiLoading(true);
    const result = await simulatedLogin(email, password, users);
    setApiLoading(false);
    if (result.success) {
      setCurrentUser(result.user);
      localStorage.setItem('kolatan_current_user', JSON.stringify(result.user));
      setActiveTab('profile');
      return true;
    }
    return false;
  };

  const handleRegister = async (newUser) => {
    setApiLoading(true);
    const result = await simulatedRegister(newUser, users);
    setApiLoading(false);
    if (result.success) {
      const updatedUsers = [...users, result.user];
      setUsers(updatedUsers);
      localStorage.setItem('kolatan_users', JSON.stringify(updatedUsers));
      
      setCurrentUser(result.user);
      localStorage.setItem('kolatan_current_user', JSON.stringify(result.user));
      setActiveTab('profile');
      return true;
    }
    return false;
  };

  const handleAddBalance = (amount) => {
    setPendingAddAmount(amount);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async (amount) => {
    setApiLoading(true);
    const result = await simulatedAddBalance(currentUser.email, amount, users);
    setApiLoading(false);
    if (result.success) {
      setCurrentUser(result.user);
      localStorage.setItem('kolatan_current_user', JSON.stringify(result.user));

      const updatedUsers = users.map(u => u.email === currentUser.email ? result.user : u);
      setUsers(updatedUsers);
      localStorage.setItem('kolatan_users', JSON.stringify(updatedUsers));
    }
  };

  const handleAwardPrize = (type, amount) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, stars: (currentUser.stars || 0) + amount };
    setCurrentUser(updatedUser);
    localStorage.setItem('kolatan_current_user', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => u.email === currentUser.email ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('kolatan_users', JSON.stringify(updatedUsers));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('kolatan_current_user');
  };

  const getLocalizedProduct = (p) => {
    return {
      ...p,
      name: translations[lang][`prod_${p.id}_name`] || p.name,
      description: translations[lang][`prod_${p.id}_desc`] || p.description
    };
  };

  const getCategoryName = (catId) => {
    const names = {
      all: lang === 'tr' ? 'Tüm Menü' : 'All Menu',
      'hot-coffee': lang === 'tr' ? 'Sıcak Kahveler' : 'Hot Coffees',
      'cold-coffee': lang === 'tr' ? 'Soğuk Kahveler' : 'Cold Coffees',
      matcha: lang === 'tr' ? 'Matcha Bölümü' : 'Matcha Section',
      frappuccino: 'Frappuccino®',
      tea: lang === 'tr' ? 'Sıcak & Soğuk Çaylar' : 'Hot & Iced Teas',
      bakery: lang === 'tr' ? 'Fırından & Yiyecek' : 'Bakery & Food'
    };
    return names[catId] || catId;
  };

  // Filter products based on category and search query
  const filteredProducts = PRODUCTS.map(getLocalizedProduct).filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectProduct = (product) => {
    if (!currentUser) {
      setLoginInitialMode('login');
      setIsLoginOpen(true);
      const alertMsg = lang === 'tr'
        ? 'Ürünleri kişiselleştirebilmek ve sipariş verebilmek için lütfen önce giriş yapın.'
        : 'Please sign in first to customize products and place orders.';
      alert(alertMsg);
      return;
    }
    setSelectedProduct(product);
  };

  const handleAddToBag = (customizedItem) => {
    if (!currentUser) {
      setLoginInitialMode('login');
      setIsLoginOpen(true);
      alert('Sepete ürün ekleyebilmek için lütfen önce giriş yapın.');
      return;
    }
    setCartItems((prevItems) => [...prevItems, customizedItem]);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (indexToRemove) => {
    setCartItems((prevItems) => prevItems.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCheckout = async (total) => {
    if (!currentUser) {
      alert(lang === 'tr' ? 'Sipariş vermek için lütfen önce giriş yapın.' : 'Please sign in to place an order.');
      setIsCartOpen(false);
      setLoginInitialMode('login');
      setIsLoginOpen(true);
      return false;
    }
    
    setApiLoading(true);
    const result = await simulatedCheckout(currentUser.email, total, cartItems, users, orderHistory);
    setApiLoading(false);

    if (!result.success) {
      alert(`Sipariş Başarısız!\n${result.message}`);
      return false;
    }

    const updatedUser = result.user;
    setCurrentUser(updatedUser);
    localStorage.setItem('kolatan_current_user', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => u.email === currentUser.email ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('kolatan_users', JSON.stringify(updatedUsers));

    const updatedOrders = [...orderHistory, result.order];
    setOrderHistory(updatedOrders);
    localStorage.setItem(currentUser.email + '_orders', JSON.stringify(updatedOrders));

    // Clear cart items
    setCartItems([]);

    // Trigger Live Order Tracker
    setActiveOrder(result.order);

    const alertMsg = lang === 'tr' 
      ? `Siparişiniz Başarıyla Alındı!\nÖdenen Tutar: ₺${total.toFixed(2)}\nKazandığınız Yıldız: +${result.order.starsEarned}\nKeyifli kahveler! ☕`
      : `Order Placed Successfully!\nAmount Paid: ₺${total.toFixed(2)}\nStars Earned: +${result.order.starsEarned}\nEnjoy! ☕`;
    alert(alertMsg);
    return true;
  };

  return (
    <>
      <Navbar 
        cartCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
        onMenuToggle={() => setIsMobileMenuOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoginClick={() => { setLoginInitialMode('login'); setIsLoginOpen(true); }}
        onRegisterClick={() => { setLoginInitialMode('register'); setIsLoginOpen(true); }}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        setLang={setLang}
      />

      {activeTab === 'menu' && (
        <>
          <div className="sb-subnav">
            <span className="sb-subnav-title">{lang === 'tr' ? 'Kategori Seçin' : 'Select Category'}</span>
            {CATEGORIES.map((c) => (
              <button 
                key={c.id} 
                className={`sb-btn-outline ${activeCategory === c.id ? 'active' : ''}`}
                style={{
                  background: activeCategory === c.id ? 'var(--sb-green)' : 'transparent',
                  color: activeCategory === c.id ? 'white' : 'var(--sb-dark)',
                  borderColor: activeCategory === c.id ? 'var(--sb-green)' : 'var(--sb-dark)',
                  padding: '6px 14px',
                  fontSize: '13px'
                }}
                onClick={() => setActiveCategory(c.id)}
              >
                {getCategoryName(c.id)}
              </button>
            ))}
          </div>

          {/* Hero Banner section */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            overflow: 'hidden',
            background: 'linear-gradient(to right, var(--sb-dark-green), #1b4d3e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 80px',
            color: 'white'
          }}>
            <div style={{ zIndex: 2, maxWidth: '50%' }}>
              <h1 style={{ color: 'white', fontSize: '38px', margin: '0 0 10px 0', fontFamily: 'var(--font-heading)' }}>
                {lang === 'tr' ? 'Yazın En Canlandırıcı Tatları' : 'Refreshing Flavors of Summer'}
              </h1>
              <p style={{ fontSize: '15px', color: '#b9dfd5', marginBottom: '20px' }}>
                {lang === 'tr' ? 'Kolatan özel soğuk demlenmiş Cold Brew ve Frappuccino lezzetleriyle sıcak günlerin tadını çıkarın.' : 'Enjoy hot summer days with special Kolatan cold brewed Cold Brew and Frappuccino flavors.'}
              </p>
            </div>
            <div style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '45%',
              background: 'url(/hero_banner.png) no-repeat center center',
              backgroundSize: 'cover',
              zIndex: 1
            }}></div>
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              background: 'linear-gradient(to right, var(--sb-dark-green) 50%, transparent 85%)',
              zIndex: 1.5
            }}></div>
          </div>

          <div className="sb-container">
            <CategorySidebar 
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              lang={lang}
            />

            <main className="sb-content">
              <div className="sb-content-header">
                <h1 className="sb-content-title">
                  {getCategoryName(activeCategory)}
                </h1>
                
                <div className="sb-search-container">
                  <Search size={18} className="sb-search-icon" />
                  <input 
                    type="text" 
                    placeholder={lang === 'tr' ? 'Menüde ara...' : 'Search in menu...'} 
                    className="sb-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--sb-text-muted)' }}>
                  {lang === 'tr' ? 'Aramanızla eşleşen ürün bulunamadı.' : 'No products found matching your search.'}
                </div>
              ) : (
                <div className="sb-products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onSelect={handleSelectProduct}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {activeTab === 'rewards' && (
        <div style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--sb-green)', fontSize: '42px', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            Her Yudumda Yıldız Kazanın!
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--sb-text-muted)', marginBottom: '40px' }}>
            Kolatan® Rewards dünyasına katılın, her siparişinizde Yıldız toplayın ve ücretsiz kahve ödüllerinin tadını çıkarın.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', margin: '40px 0' }}>
            <div style={{ padding: '30px', background: 'var(--sb-cream)', borderRadius: '12px' }}>
              <div style={{ fontSize: '42px', marginBottom: '15px' }}>📱</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Uygulamayı İndir</h3>
              <p style={{ fontSize: '14px', color: 'var(--sb-text-muted)' }}>Kolatan Türkiye mobil uygulamasını indirip hesabınızı dakikalar içinde oluşturun.</p>
            </div>
            <div style={{ padding: '30px', background: 'var(--sb-cream)', borderRadius: '12px' }}>
              <div style={{ fontSize: '42px', marginBottom: '15px' }}>⭐</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Yıldız Biriktir</h3>
              <p style={{ fontSize: '14px', color: 'var(--sb-text-muted)' }}>Her 10 TL harcamanıza 1 Yıldız kazanın. Temassız ödeme avantajlarından yararlanın.</p>
            </div>
            <div style={{ padding: '30px', background: 'var(--sb-cream)', borderRadius: '12px' }}>
              <div style={{ fontSize: '42px', marginBottom: '15px' }}>☕</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Hediye İçecek Al</h3>
              <p style={{ fontSize: '14px', color: 'var(--sb-text-muted)' }}>15 Yıldız biriktiğinde, dilediğiniz bir Tall boy Tall kahve hediye!</p>
            </div>
          </div>

          <button className="sb-btn-solid" style={{ padding: '14px 40px', fontSize: '16px' }}>Hemen Katıl</button>
        </div>
      )}

      {activeTab === 'gift' && (
        <div style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--sb-dark-green)', fontSize: '42px', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
            {lang === 'tr' ? 'Sevdiklerinize Kahve Hediye Edin' : 'Gift Coffee to Your Loved Ones'}
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--sb-text-muted)', marginBottom: '40px' }}>
            {lang === 'tr' ? 'Kolatan e-Gift Kartları ile arkadaşlarınıza ve ailenize harika bir kahve sürprizi gönderin.' : 'Send a wonderful coffee surprise to your friends and family with Kolatan e-Gift Cards.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', margin: '40px 0' }}>
            <div style={{ background: 'linear-gradient(135deg, #006241 0%, #1e3932 100%)', borderRadius: '16px', height: '180px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'white', textAlign: 'left', boxShadow: 'var(--sb-shadow-md)' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>KOLATAN®</span>
              <span style={{ fontSize: '14px', opacity: 0.8 }}>{lang === 'tr' ? 'Teşekkür Ederim' : 'Thank You'}</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #cba258 0%, #a27a3c 100%)', borderRadius: '16px', height: '180px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'white', textAlign: 'left', boxShadow: 'var(--sb-shadow-md)' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>KOLATAN®</span>
              <span style={{ fontSize: '14px', opacity: 0.8 }}>{lang === 'tr' ? 'Mutlu Yıllar' : 'Happy New Year'}</span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #FF5252 0%, #FF1744 100%)', borderRadius: '16px', height: '180px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'white', textAlign: 'left', boxShadow: 'var(--sb-shadow-md)' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>KOLATAN®</span>
              <span style={{ fontSize: '14px', opacity: 0.8 }}>{lang === 'tr' ? 'Doğum Günün Kutlu Olsun' : 'Happy Birthday'}</span>
            </div>
          </div>

          <button className="sb-btn-solid" style={{ padding: '14px 40px', fontSize: '16px' }}>{lang === 'tr' ? 'Hediye Kartı Gönder' : 'Send a Gift Card'}</button>
        </div>
      )}

      {activeTab === 'stores' && (
        <StoreLocator lang={lang} />
      )}

      {activeTab === 'profile' && currentUser && (
        <ProfileDashboard 
          currentUser={currentUser} 
          onAddBalance={handleAddBalance} 
          orderHistory={orderHistory} 
          onAwardPrize={handleAwardPrize}
          lang={lang}
        />
      )}

      {/* Footer */}
      <footer className="sb-footer">
        <div className="sb-footer-links">
          <a href="#about">{lang === 'tr' ? 'Hakkımızda' : 'About Us'}</a>
          <a href="#careers">{lang === 'tr' ? 'Kariyer' : 'Careers'}</a>
          <a href="#contact">{lang === 'tr' ? 'İletişim' : 'Contact'}</a>
          <a href="#privacy">{lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}</a>
          <a href="#terms">{lang === 'tr' ? 'Kullanım Koşulları' : 'Terms of Use'}</a>
        </div>
        <p>© {new Date().getFullYear()} Kolatan Coffee Company. {lang === 'tr' ? 'Tüm hakları saklıdır. Bu bir simülasyon projesidir.' : 'All rights reserved. This is a simulation project.'}</p>
      </footer>

      {/* Modal Customizer */}
      {selectedProduct && (
        <CustomizeModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToBag={handleAddToBag}
          lang={lang}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onCheckout={handleCheckout}
        lang={lang}
      />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        initialMode={loginInitialMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        lang={lang}
      />

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoginClick={() => { setLoginInitialMode('login'); setIsLoginOpen(true); }}
        onRegisterClick={() => { setLoginInitialMode('register'); setIsLoginOpen(true); }}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        setLang={setLang}
      />

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handlePaymentSuccess}
        amount={pendingAddAmount}
        lang={lang}
      />

      <OrderTracker 
        lang={lang}
        activeOrder={activeOrder}
        onClose={() => setActiveOrder(null)}
      />

      {apiLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          gap: '16px'
        }}>
          <div className="sb-logo-circle" style={{ animation: 'spin 1.5s linear infinite', width: '60px', height: '60px', fontSize: '32px' }}>★</div>
          <span style={{ fontWeight: '600', fontSize: '15px', fontFamily: 'var(--font-heading)' }}>
            {translations[lang]?.loading || 'Lütfen Bekleyin...'}
          </span>
        </div>
      )}
    </>
  );
}
