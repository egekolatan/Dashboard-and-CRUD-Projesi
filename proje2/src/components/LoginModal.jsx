import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, ArrowRight, AtSign } from 'lucide-react';
import { translations } from '../services/translations';

const AVATARS = ['☕', '🥤', '🥐', '🍪', '🍩', '🍰', '🌟', '🐼', '🦁', '🐱', '🦊', '🦄'];

export default function LoginModal({ isOpen, onClose, initialMode = 'login', onLogin, onRegister, lang }) {
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

  const t = translations[lang] || translations.tr;

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
        setErrorMsg(
          lang === 'tr'
            ? 'Hatalı e-posta veya şifre! Lütfen harfleri, noktalama işaretlerini ve büyük/küçük harfleri kontrol edin.'
            : 'Incorrect email or password! Please check letters, punctuation, and capitalization.'
        );
      }
    } else {
      if (!username || username.trim().length < 3) {
        setErrorMsg(
          lang === 'tr'
            ? 'Lütfen en az 3 karakterden oluşan geçerli bir kullanıcı adı girin.'
            : 'Please enter a valid username of at least 3 characters.'
        );
        return;
      }
      const success = await onRegister({ name, email, password, username, avatar: selectedAvatar });
      if (success) {
        const welcomeMsg = lang === 'tr'
          ? `Kayıt Başarılı!\nHesabınız oluşturuldu ve giriş yapıldı: @${username}`
          : `Registration Successful!\nYour account was created and you are signed in: @${username}`;
        alert(welcomeMsg);
        onClose();
        setEmail('');
        setPassword('');
        setName('');
        setUsername('');
        setErrorMsg('');
      } else {
        setErrorMsg(
          lang === 'tr'
            ? 'Bu e-posta adresi veya kullanıcı adı zaten kullanımda.'
            : 'This email address or username is already in use.'
        );
      }
    }
  };

  return (
    <div className="sb-modal-overlay" onClick={onClose}>
      {/* Modal Container */}
      <div className="sb-modal" style={{ maxWidth: '480px', padding: '0', display: 'flex', flexDirection: 'column', height: 'auto', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div style={{ padding: '24px 30px', borderBottom: '1px solid var(--sb-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '22px', color: 'var(--sb-dark-green)', margin: 0 }}>
            {mode === 'login' ? t.login : t.register}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--sb-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--sb-border)' }}>
          <button 
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '16px 0',
              fontWeight: 'bold',
              fontSize: '14px',
              color: mode === 'login' ? 'var(--sb-green)' : 'var(--sb-text-muted)',
              borderBottom: mode === 'login' ? '3px solid var(--sb-green)' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {t.login}
          </button>
          <button 
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '16px 0',
              fontWeight: 'bold',
              fontSize: '14px',
              color: mode === 'register' ? 'var(--sb-green)' : 'var(--sb-text-muted)',
              borderBottom: mode === 'register' ? '3px solid var(--sb-green)' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {t.register}
          </button>
        </div>

        {/* Form Body - Scroll Enabled */}
        <div style={{ padding: '30px', maxHeight: '65vh', overflowY: 'auto' }}>
          {errorMsg && (
            <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', marginBottom: '20px', lineHeight: '1.4' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* REGISTER FIELDS */}
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--sb-dark)' }}>
                    {lang === 'tr' ? 'Ad Soyad' : 'Full Name'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="Ege Kolatan" 
                      className="sb-search-input"
                      style={{ paddingLeft: '38px', width: '100%', height: '44px' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--sb-dark)' }}>
                    {lang === 'tr' ? 'Kullanıcı Adı' : 'Username'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <AtSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
                    <input 
                      type="text" 
                      placeholder="egekolatan" 
                      className="sb-search-input"
                      style={{ paddingLeft: '38px', width: '100%', height: '44px' }}
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                      required
                    />
                  </div>
                </div>

                {/* Avatar Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--sb-dark)' }}>
                    {lang === 'tr' ? 'Profil Avatarı Seçin' : 'Select Profile Avatar'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                    {AVATARS.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        style={{
                          fontSize: '24px',
                          height: '46px',
                          borderRadius: '8px',
                          backgroundColor: selectedAvatar === avatar ? 'var(--sb-cream)' : 'var(--sb-bg)',
                          border: `2px solid ${selectedAvatar === avatar ? 'var(--sb-green)' : 'var(--sb-border)'}`,
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--sb-dark)' }}>
                {lang === 'tr' ? 'E-posta Adresi' : 'Email Address'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
                <input 
                  type="email" 
                  placeholder="egekolatan114@gmail.com" 
                  className="sb-search-input"
                  style={{ paddingLeft: '38px', width: '100%', height: '44px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--sb-dark)' }}>
                {lang === 'tr' ? 'Şifre' : 'Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder={mode === 'login' ? 'ege352008' : '••••••••'} 
                  className="sb-search-input"
                  style={{ paddingLeft: '38px', paddingRight: '40px', width: '100%', height: '44px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sb-text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember / Agreement checkboxes */}
            {mode === 'login' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span>{lang === 'tr' ? 'Beni Hatırla' : 'Remember Me'}</span>
                </label>
                <a href="#forgot" style={{ color: 'var(--sb-green)', fontWeight: '600', textDecoration: 'none' }}>
                  {lang === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password?'}
                </a>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '12px', lineHeight: '1.4' }}>
                <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} required style={{ marginTop: '3px' }} />
                <span>
                  {lang === 'tr' 
                    ? 'Kolatan® Rewards Gizlilik Bildirimi ve Kullanım Koşullarını okudum, kabul ediyorum.'
                    : 'I agree to the Kolatan® Rewards Privacy Policy and Terms of Use.'}
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="sb-btn-solid" 
              style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}
            >
              <span>{mode === 'login' ? t.login : t.register}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
