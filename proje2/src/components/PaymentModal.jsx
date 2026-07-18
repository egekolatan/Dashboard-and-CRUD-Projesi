import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, onConfirm, amount }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      setExpiry(value.substring(0, 2) + '/' + value.substring(2, 4));
    } else {
      setExpiry(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate secure 3D Secure bank authorization delay
    setTimeout(() => {
      setLoading(false);
      onConfirm(amount);
      onClose();
      setCardNumber('');
      setCardName('');
      setExpiry('');
      setCvc('');
    }, 1500);
  };

  return (
    <div className="sb-modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div 
        className="sb-modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '450px', height: 'auto', maxHeight: '90vh', borderRadius: '16px', flexDirection: 'column' }}
      >
        <button className="sb-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ padding: '30px 40px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '20px', color: 'var(--sb-dark-green)', marginBottom: '4px' }}>
            Güvenli Ödeme Geçidi
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--sb-text-muted)', marginBottom: '20px' }}>
            Cüzdanınıza <strong>₺{amount.toFixed(2)}</strong> yüklemek üzeresiniz.
          </p>

          {/* Interactive Card Preview */}
          <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', opacity: 0.8 }}>KOLATAN CARD</span>
                  <CreditCard size={28} />
                </div>
                <div style={{ fontSize: '20px', letterSpacing: '2px', fontWeight: 'bold', margin: '20px 0' }}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <div>
                    <span style={{ fontSize: '9px', display: 'block', opacity: 0.6 }}>KART SAHİBİ</span>
                    <span>{cardName.toUpperCase() || 'AD SOYAD'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '9px', display: 'block', opacity: 0.6 }}>SKT</span>
                    <span>{expiry || 'AA/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div className="flip-card-back" style={{ textAlign: 'left' }}>
                <div style={{ height: '35px', backgroundColor: '#111111', margin: '0 -24px 15px -24px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '30px', backgroundColor: '#e0e0e0', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', fontSize: '12px', fontStyle: 'italic' }}>
                    {cardNumber.replace(/\s/g, '').substring(12) || '••••'}
                  </div>
                  <div style={{ width: '50px', height: '30px', backgroundColor: 'white', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                    {cvc || '•••'}
                  </div>
                </div>
                <div style={{ fontSize: '9px', opacity: 0.5, marginTop: '20px', lineHeight: '1.3' }}>
                  Bu cüzdan kartı Kolatan Coffee Company tarafından simüle edilmiştir. Güvenliğiniz için gerçek kart bilgilerinizi girmeyiniz.
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '16px' }}>
              <div className="sb-logo-circle" style={{ animation: 'spin 1s linear infinite', width: '40px', height: '40px' }}>★</div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--sb-green)' }}>3D Secure Doğrulaması Yapılıyor...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--sb-dark)' }}>Kart Üzerindeki İsim</label>
                <input
                  type="text"
                  required
                  placeholder="Ad Soyad"
                  className="sb-search-input"
                  style={{ borderRadius: '8px', background: 'white', height: '38px', paddingLeft: '14px' }}
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--sb-dark)' }}>Kart Numarası</label>
                <input
                  type="text"
                  required
                  placeholder="0000 0000 0000 0000"
                  className="sb-search-input"
                  style={{ borderRadius: '8px', background: 'white', height: '38px', paddingLeft: '14px' }}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--sb-dark)' }}>Son Kullanma</label>
                  <input
                    type="text"
                    required
                    placeholder="AA/YY"
                    className="sb-search-input"
                    style={{ borderRadius: '8px', background: 'white', height: '38px', paddingLeft: '14px' }}
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength="5"
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--sb-dark)' }}>CVC</label>
                  <input
                    type="text"
                    required
                    placeholder="•••"
                    className="sb-search-input"
                    style={{ borderRadius: '8px', background: 'white', height: '38px', paddingLeft: '14px' }}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    maxLength="3"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--sb-text-muted)', marginTop: '6px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--sb-green)' }} />
                <span>SSL Korumalı 256-Bit Güvenli Ödeme Bağlantısı</span>
              </div>

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
                  marginTop: '10px'
                }}
              >
                ₺{amount.toFixed(2)} Öde ve Yükle
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
