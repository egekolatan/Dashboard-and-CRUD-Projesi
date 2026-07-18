import React from 'react';
import { ShoppingBag, Menu, MapPin, Sun, Moon } from 'lucide-react';

export default function Navbar({ cartCount, onCartClick, onMenuToggle, activeTab, setActiveTab, onLoginClick, onRegisterClick, currentUser, onLogout, theme, toggleTheme }) {
  return (
    <nav className="sb-navbar">
      <div className="sb-navbar-left">
        <a href="/" className="sb-logo-container" onClick={(e) => { e.preventDefault(); setActiveTab('menu'); }}>
          <div className="sb-logo-circle">★</div>
          <span>KOLATAN</span>
        </a>
        <ul className="sb-nav-links">
          <li>
            <button 
              className={`sb-nav-link ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              Menü
            </button>
          </li>
          <li>
            <button 
              className={`sb-nav-link ${activeTab === 'rewards' ? 'active' : ''}`}
              onClick={() => setActiveTab('rewards')}
            >
              Kolatan® Rewards
            </button>
          </li>
          <li>
            <button 
              className={`sb-nav-link ${activeTab === 'gift' ? 'active' : ''}`}
              onClick={() => setActiveTab('gift')}
            >
              Hediye Kartları
            </button>
          </li>
          {currentUser && (
            <li>
              <button 
                className={`sb-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profil & Cüzdan
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="sb-navbar-right">
        <div className="sb-nav-actions">
          <button 
            className={`sb-btn-outline ${activeTab === 'stores' ? 'active' : ''}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => setActiveTab('stores')}
          >
            <MapPin size={16} />
            <span>Mağaza Bul</span>
          </button>
          {currentUser ? (
            <>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--sb-dark)', alignSelf: 'center' }}>
                <span style={{ fontSize: '18px' }}>{currentUser.avatar || '☕'}</span>
                @{currentUser.username}
              </span>
              <button className="sb-btn-outline" onClick={onLogout}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <button className="sb-btn-outline" onClick={onLoginClick}>Giriş Yap</button>
              <button className="sb-btn-solid" onClick={onRegisterClick}>Hemen Katıl</button>
            </>
          )}
        </div>

        <button 
          className="sb-btn-cart" 
          style={{ marginRight: '4px' }} 
          onClick={toggleTheme}
          aria-label="Tema Değiştir"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="sb-btn-cart" onClick={onCartClick} aria-label="Sepetim">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="sb-cart-badge">{cartCount}</span>}
        </button>

        <button className="sb-menu-toggle" onClick={onMenuToggle} aria-label="Menü Aç">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
