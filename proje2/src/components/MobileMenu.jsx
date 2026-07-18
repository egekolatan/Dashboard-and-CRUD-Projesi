import React from 'react';
import { X, MapPin, User, LogOut, Sun, Moon, CreditCard, Award, Gift, Coffee, Globe } from 'lucide-react';
import { translations } from '../services/translations';

export default function MobileMenu({ 
  isOpen, 
  onClose, 
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
  if (!isOpen) return null;

  const t = translations[lang] || translations.tr;

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Dark overlay backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      ></div>

      {/* Slide-over menu panel */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '300px',
          height: '100%',
          backgroundColor: 'var(--sb-bg)',
          zIndex: 1001,
          boxShadow: 'var(--sb-shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s cubic-bezier(0.1, 0.8, 0.1, 1)',
          borderLeft: '1px solid var(--sb-border)',
          color: 'var(--sb-dark)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--sb-border)' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-green)' }}>KOLATAN MENU</span>
          <button onClick={onClose} style={{ color: 'var(--sb-dark)', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* User Profile Info (If Logged In) */}
        {currentUser ? (
          <div style={{ padding: '24px', backgroundColor: 'var(--sb-cream)', borderBottom: '1px solid var(--sb-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '32px', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sb-shadow-sm)' }}>
                {currentUser.avatar || '☕'}
              </div>
              <div>
                <strong style={{ fontSize: '15px', display: 'block' }}>{currentUser.name}</strong>
                <span style={{ fontSize: '12px', color: 'var(--sb-text-muted)' }}>@{currentUser.username}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={16} />
                <span>₺{(currentUser.balance || 0).toFixed(2)}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={16} style={{ color: '#cba258' }} />
                <span>{currentUser.stars || 0} {t.stars}</span>
              </span>
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px', borderBottom: '1px solid var(--sb-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontSize: '12px', color: 'var(--sb-text-muted)', margin: '0 0 4px 0' }}>
              {lang === 'tr' 
                ? 'Hesabınıza giriş yaparak sipariş verebilir ve cüzdanınızı kullanabilirsiniz.' 
                : 'Sign in to your account to place orders and manage your wallet.'}
            </p>
            <button 
              className="sb-btn-outline" 
              style={{ width: '100%', padding: '10px', borderRadius: '8px' }} 
              onClick={() => { onLoginClick(); onClose(); }}
            >
              {t.login}
            </button>
            <button 
              className="sb-btn-solid" 
              style={{ width: '100%', padding: '10px', borderRadius: '8px' }} 
              onClick={() => { onRegisterClick(); onClose(); }}
            >
              {t.register}
            </button>
          </div>
        )}

        {/* Navigation List */}
        <div style={{ flexGrow: 1, padding: '20px 0', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>
              <button 
                onClick={() => handleLinkClick('menu')}
                style={{ width: '100%', textAlign: 'left', padding: '14px 24px', fontSize: '15px', fontWeight: activeTab === 'menu' ? '700' : '500', color: activeTab === 'menu' ? 'var(--sb-green)' : 'inherit', backgroundColor: activeTab === 'menu' ? 'var(--sb-cream)' : 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Coffee size={18} />
                <span>{t.menu}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleLinkClick('rewards')}
                style={{ width: '100%', textAlign: 'left', padding: '14px 24px', fontSize: '15px', fontWeight: activeTab === 'rewards' ? '700' : '500', color: activeTab === 'rewards' ? 'var(--sb-green)' : 'inherit', backgroundColor: activeTab === 'rewards' ? 'var(--sb-cream)' : 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Award size={18} />
                <span>{t.rewards}</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleLinkClick('gift')}
                style={{ width: '100%', textAlign: 'left', padding: '14px 24px', fontSize: '15px', fontWeight: activeTab === 'gift' ? '700' : '500', color: activeTab === 'gift' ? 'var(--sb-green)' : 'inherit', backgroundColor: activeTab === 'gift' ? 'var(--sb-cream)' : 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <Gift size={18} />
                <span>{t.gift}</span>
              </button>
            </li>
            {currentUser && (
              <li>
                <button 
                  onClick={() => handleLinkClick('profile')}
                  style={{ width: '100%', textAlign: 'left', padding: '14px 24px', fontSize: '15px', fontWeight: activeTab === 'profile' ? '700' : '500', color: activeTab === 'profile' ? 'var(--sb-green)' : 'inherit', backgroundColor: activeTab === 'profile' ? 'var(--sb-cream)' : 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <User size={18} />
                  <span>{t.profileWallet}</span>
                </button>
              </li>
            )}
            <li>
              <button 
                onClick={() => handleLinkClick('stores')}
                style={{ width: '100%', textAlign: 'left', padding: '14px 24px', fontSize: '15px', fontWeight: activeTab === 'stores' ? '700' : '500', color: activeTab === 'stores' ? 'var(--sb-green)' : 'inherit', backgroundColor: activeTab === 'stores' ? 'var(--sb-cream)' : 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <MapPin size={18} />
                <span>{t.storeLocator}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--sb-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Theme switcher */}
            <button 
              onClick={toggleTheme} 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === 'dark' ? (lang === 'tr' ? 'Aydınlık' : 'Light') : (lang === 'tr' ? 'Karanlık' : 'Dark')}</span>
            </button>

            {/* Language Switcher */}
            <button 
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '800' }}
            >
              <Globe size={18} />
              <span>{lang === 'tr' ? 'English (EN)' : 'Türkçe (TR)'}</span>
            </button>
          </div>

          {/* Logout (if logged in) */}
          {currentUser && (
            <button 
              onClick={() => { onLogout(); onClose(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#c62828', width: '100%', justifyContent: 'center', border: '1px solid #ffcdd2', padding: '8px 0', borderRadius: '8px', marginTop: '4px' }}
            >
              <LogOut size={18} />
              <span>{t.logout}</span>
            </button>
          )}
        </div>
      </div>

      {/* Injected CSS keyframes for mobile menu transitions */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
