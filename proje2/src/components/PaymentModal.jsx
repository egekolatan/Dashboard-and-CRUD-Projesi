import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';
import { translations } from '../services/translations';

export default function PaymentModal({ isOpen, onClose, onConfirm, amount, lang }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const t = translations[lang] || translations.tr;

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
    if (value.length > 2) {
      setExpiry(value.substring(0, 2) + '/' + value.substring(2, 4));
    } else {
      setExpiry(value);
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvc(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length < 19 || !cardName.trim() || expiry.length < 5 || cvc.length < 3) {
      alert(lang === 'tr' ? 'Lütfen tüm kart bilgilerini eksiksiz girin.' : 'Please fill in all card details.');
      return;
    }

    setLoading(true);
    // Simulate 3D Secure bank routing latency
    setTimeout(() => {
      setLoading(false);
      onConfirm(amount);
      setCardNumber('');
      setCardName('');
      setExpiry('');
      setCvc('');
      onClose();
    }, 2000);
  };

  return (
    <div className="sb-modal-overlay" style={{ zIndex: 110 }} onClick={onClose}>
      <div className="sb-modal" style={{ zIndex: 111, maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="sb-modal-header">
          <h2 className="sb-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={22} className="sb-green-icon" />
            <span>{lang === 'tr' ? 'Güvenli Ödeme' : 'Secure Payment'}</span>
          </h2>
          <button className="sb-modal-close" onClick={onClose} aria-label="Kapat">
            <X size={24} />
          </button>
        </div>

        <div className="sb-modal-body" style={{ paddingBottom: '10px' }}>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--sb-text-muted)', textAlign: 'center' }}>
            {lang === 'tr' 
              ? `Cüzdanınıza yüklenen tutar: ₺${amount.toFixed(2)}`
              : `Amount to add to wallet: ₺${amount.toFixed(2)}`}
          </p>

          {/* Interactive 3D Card Display */}
          <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
            <div className="flip-card-inner">
              {/* Front side */}
              <div className="flip-card-front">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>KOLATAN CARD</span>
                  <div style={{ width: '40px', height: '26px', backgroundColor: '#e5a65d', borderRadius: '4px', opacity: 0.8 }}></div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', wordSpacing: '4px', marginBottom: '20px', textAlign: 'left' }}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', textTransform: 'uppercase' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ opacity: 0.6, fontSize: '8px', marginBottom: '2px' }}>{lang === 'tr' ? 'KART SAHİBİ' : 'CARD HOLDER'}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px' }}>{cardName || 'AD SOYAD'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ opacity: 0.6, fontSize: '8px', marginBottom: '2px' }}>{lang === 'tr' ? 'SKT' : 'EXP'}</div>
                    <div style={{ fontWeight: 'bold', fontSize: '11px', letterSpacing: '1px' }}>{expiry || 'AA/YY'}</div>
                  </div>
                </div>
              </div>

              {/* Back side */}
              <div className="flip-card-back">
                <div style={{ width: '100%', height: '36px', backgroundColor: '#111', margin: '10px 0', position: 'absolute', top: 10, left: 0 }}></div>
                <div style={{ width: '80%', height: '24px', backgroundColor: '#fff', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px', color: '#333', fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic', margin: '50px auto 0 auto' }}>
                  {cvc || '•••'}
                </div>
                <div style={{ fontSize: '8px', opacity: 0.5, marginTop: '30px', padding: '0 20px', lineHeight: '1.3' }}>
                  This card is property of Kolatan Rewards. Protected by 256-bit SSL secure protocol.
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--sb-dark)' }}>{lang === 'tr' ? 'Kart Sahibi Ad Soyad' : 'Cardholder Name'}</label>
              <input
                type="text"
                placeholder="EGE KOLATAN"
                className="sb-search-input"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--sb-dark)' }}>{lang === 'tr' ? 'Kart Numarası' : 'Card Number'}</label>
              <input
                type="text"
                placeholder="4000 1234 5678 9010"
                className="sb-search-input"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--sb-dark)' }}>{lang === 'tr' ? 'Son Kullanma' : 'Expiry Date'}</label>
                <input
                  type="text"
                  placeholder="AA/YY"
                  className="sb-search-input"
                  value={expiry}
                  onChange={handleExpiryChange}
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--sb-dark)' }}>CVC (CVV)</label>
                <input
                  type="password"
                  placeholder="123"
                  className="sb-search-input"
                  value={cvc}
                  onChange={handleCvcChange}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0', fontSize: '11px', color: 'var(--sb-text-muted)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--sb-green)' }} />
              <span>{lang === 'tr' ? '256-bit SSL Güvenli Bağlantı ve 3D Secure onaylama.' : '256-bit SSL Secure and 3D Secure verification.'}</span>
            </div>

            <button
              type="submit"
              className="sb-btn-solid"
              style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '6px' }}
              disabled={loading}
            >
              {loading 
                ? (lang === 'tr' ? 'Ödeme Doğrulanıyor...' : 'Verifying Payment...') 
                : (lang === 'tr' ? `₺${amount.toFixed(2)} Öde ve Yükle` : `Pay & Load ₺${amount.toFixed(2)}`)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
