import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, ArrowRight, AtSign } from 'lucide-react';

const AVATARS = ['☕', '🥤', '🥐', '🍪', '🍩', '🍰', '🌟', '🐼', '🦁', '🐱', '🦊', '🦄'];

export default function LoginModal({ isOpen, onClose, initialMode = 'login', onLogin, onRegister }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('☕');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      const success = await onLogin(email, password);
      if (success) {
        onClose();
        setEmail('');
        setPassword('');
      } else {
        setErrorMsg('Hatalı e-posta veya şifre! Lütfen harfleri, noktalama işaretlerini ve büyük/küçük harfleri kontrol edin.');
      }
    } else {
      if (!username || username.trim().length < 3) {
        setErrorMsg('Lütfen en az 3 karakterden oluşan geçerli bir kullanıcı adı girin.');
        return;
      }
      const success = await onRegister({ name, email, password, username, avatar: selectedAvatar });
      if (success) {
        alert(`Kayıt Başarılı!\nHesabınız oluşturuldu ve giriş yapıldı: @${username}`);
        onClose();
        setEmail('');
        setPassword('');
        setName('');
        setUsername('');
        setErrorMsg('');
      } else {
        setErrorMsg('Bu e-posta adresi veya kullanıcı adı zaten kullanımda.');
      }
    }
  };

  return (
    <div className="sb-modal-overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div 
        className="sb-modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '480px', height: 'auto', maxHeight: '95vh', borderRadius: '16px' }}
      >
        <button className="sb-modal-close" onClick={onClose} aria-label="Kapat">
          <X size={20} />
        </button>

        <div style={{ width: '100%', padding: '30px 40px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Logo / Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'var(--sb-green)',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: '800',
              marginBottom: '10px',
              boxShadow: 'var(--sb-shadow-sm)'
            }}>
              ★
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '22px', color: 'var(--sb-dark-green)' }}>
              {mode === 'login' ? 'Kolatan\'a Giriş Yap' : 'Kolatan Dünyasına Katıl'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--sb-text-muted)', marginTop: '4px' }}>
              {mode === 'login' ? 'Yıldız kazanmaya başlamak için hesabınıza erişin.' : 'Hemen üye olun, her siparişte hediye içecek kazanın.'}
            </p>
          </div>

          {errorMsg && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '16px',
              border: '1px solid #ffcdd2'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--sb-dark)' }}>Ad Soyad</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
                    <input
                      type="text"
                      required
                      placeholder="Adınız Soyadınız"
                      className="sb-search-input"
                      style={{ paddingLeft: '38px', borderRadius: '8px', background: 'white', paddingRight: '12px', height: '40px' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--sb-dark)' }}>Kullanıcı Adı</label>
                  <div style={{ position: 'relative' }}>
                    <AtSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
                    <input
                      type="text"
                      required
                      placeholder="kullanici_adi"
                      className="sb-search-input"
                      style={{ paddingLeft: '38px', borderRadius: '8px', background: 'white', paddingRight: '12px', height: '40px' }}
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    />
                  </div>
                </div>

                {/* Avatar Picker Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--sb-dark)' }}>Bir Avatar Seçin</label>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(6, 1fr)', 
                    gap: '8px', 
                    background: 'var(--sb-cream)', 
                    padding: '10px', 
                    borderRadius: '8px'
                  }}>
                    {AVATARS.map((av) => (
                      <button
                        key={av}
                        type="button"
                        style={{
                          fontSize: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: selectedAvatar === av ? 'var(--sb-green)' : 'transparent',
                          transition: 'all 0.2s ease',
                          border: selectedAvatar === av ? '2px solid white' : 'none'
                        }}
                        onClick={() => setSelectedAvatar(av)}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--sb-dark)' }}>E-posta Adresi</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="sb-search-input"
                  style={{ paddingLeft: '38px', borderRadius: '8px', background: 'white', paddingRight: '12px', height: '40px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--sb-dark)' }}>Şifre</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="sb-search-input"
                  style={{ paddingLeft: '38px', paddingRight: '42px', borderRadius: '8px', background: 'white', height: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'login' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyAlignment: 'space-between', justifyContent: 'space-between', fontSize: '13px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--sb-green)' }}
                  />
                  <span>Beni Hatırla</span>
                </label>
                <a href="#forgot" style={{ color: 'var(--sb-green)', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); alert('Şifre sıfırlama bağlantısı gönderildi.'); }}>
                  Şifremi Unuttum
                </a>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', cursor: 'pointer', lineHeight: '1.4' }}>
                <input
                  type="checkbox"
                  required
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                  style={{ accentColor: 'var(--sb-green)', marginTop: '3px' }}
                />
                <span>Kullanım Koşullarını ve Üyelik Sözleşmesini okudum, kabul ediyorum.</span>
              </label>
            )}

            <button 
              type="submit" 
              className="sb-btn-solid" 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--sb-green)',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              <span>{mode === 'login' ? 'Giriş Yap' : 'Üye Ol'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Social Logins */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0 10px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--sb-border)' }}></div>
            <span style={{ fontSize: '11px', color: 'var(--sb-text-muted)', textTransform: 'uppercase' }}>veya</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--sb-border)' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="sb-btn-outline" 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', fontSize: '12px', borderRadius: '8px' }}
              onClick={() => alert('Google ile giriş simüle edildi.')}
            >
              <span>Google ile</span>
            </button>
            <button 
              className="sb-btn-outline" 
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', fontSize: '12px', borderRadius: '8px' }}
              onClick={() => alert('Apple ile giriş simüle edildi.')}
            >
              <span>Apple ile</span>
            </button>
          </div>

          {/* Footer toggle */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--sb-text-muted)' }}>
            {mode === 'login' ? (
              <>
                Henüz hesabınız yok mu?{' '}
                <button 
                  style={{ color: 'var(--sb-green)', fontWeight: '600' }} 
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                >
                  Hemen Üye Ol
                </button>
              </>
            ) : (
              <>
                Zaten üye misiniz?{' '}
                <button 
                  style={{ color: 'var(--sb-green)', fontWeight: '600' }} 
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                >
                  Giriş Yap
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
