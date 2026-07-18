import React from 'react';
import { ShoppingBag, Menu, MapPin, Sun, Moon } from 'lucide-react';
import { translations } from '../services/translations';

export default function Navbar({ 
  cartCount, 
  onCartClick, 
  onMenuToggle, 
  activeTab, 
  setActiveTab, 
  onLoginClick, 
  onRegisterClick, 
  currentUser, 
  onLogout, 
  theme, 
  toggleTheme,
  lang,
  setLang
}) {
  const t = translations[lang] || translations.tr;

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
              {t.menu}
            </button>
          </li>
          <li>
            <button 
              className={`sb-nav-link ${activeTab === 'rewards' ? 'active' : ''}`}
              onClick={() => setActiveTab('rewards')}
            >
              {t.rewards}
            </button>
          </li>
          <li>
            <button 
              className={`sb-nav-link ${activeTab === 'gift' ? 'active' : ''}`}
              onClick={() => setActiveTab('gift')}
            >
              {t.gift}
            </button>
          </li>
          {currentUser && (
            <li>
              <button 
                className={`sb-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                {t.profileWallet}
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
            <span>{t.storeLocator}</span>
          </button>
          {currentUser ? (
            <>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--sb-dark)', alignSelf: 'center' }}>
                <span style={{ fontSize: '18px' }}>{currentUser.avatar || '☕'}</span>
                @{currentUser.username}
              </span>
              <button className="sb-btn-outline" onClick={onLogout}>{t.logout}</button>
            </>
          ) : (
            <>
              <button className="sb-btn-outline" onClick={onLoginClick}>{t.login}</button>
              <button className="sb-btn-solid" onClick={onRegisterClick}>{t.register}</button>
            </>
          )}
        </div>

        {/* Language Switcher */}
        <button 
          className="sb-btn-cart" 
          style={{ marginRight: '4px', fontSize: '12px', fontWeight: '800', fontFamily: 'var(--font-heading)' }} 
          onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
          aria-label="Dil Değiştir / Change Language"
        >
          {lang === 'tr' ? 'EN' : 'TR'}
        </button>

        {/* Theme Toggle */}
        <button 
          className="sb-btn-cart" 
          style={{ marginRight: '4px' }} 
          onClick={toggleTheme}
          aria-label="Tema Değiştir"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Cart Trigger */}
        <button className="sb-btn-cart" onClick={onCartClick} aria-label="Sepetim">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="sb-cart-badge">{cartCount}</span>}
        </button>

        {/* Mobile Menu Trigger */}
        <button className="sb-menu-toggle" onClick={onMenuToggle} aria-label="Menü Aç">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
