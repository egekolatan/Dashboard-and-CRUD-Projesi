import React, { useState } from 'react';
import { CreditCard, Star, Clock, Plus, Award, User, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function ProfileDashboard({ currentUser, onAddBalance, orderHistory, onAwardPrize }) {
  const [addAmount, setAddAmount] = useState('');
  
  // Wheel states
  const todayStr = new Date().toDateString();
  const [lastSpunDate, setLastSpunDate] = useState(() => localStorage.getItem(`last_spun_${currentUser.email}`) || '');
  const hasSpunToday = lastSpunDate === todayStr;
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const handleQuickAdd = (amount) => {
    onAddBalance(amount);
  };

  const handleCustomAdd = (e) => {
    e.preventDefault();
    const val = parseFloat(addAmount);
    if (!isNaN(val) && val > 0) {
      onAddBalance(val);
      setAddAmount('');
    }
  };

  const spinWheel = () => {
    if (hasSpunToday || spinning) return;
    setSpinning(true);

    const prizes = [
      { name: '+10 ₺ Bakiye', type: 'balance', value: 10, deg: 30 },
      { name: '+2 Yıldız', type: 'stars', value: 2, deg: 90 },
      { name: '+20 ₺ Bakiye', type: 'balance', value: 20, deg: 150 },
      { name: '+5 Yıldız', type: 'stars', value: 5, deg: 210 },
      { name: 'Tekrar Dene', type: 'none', value: 0, deg: 270 },
      { name: '+15 ₺ Bakiye', type: 'balance', value: 15, deg: 330 }
    ];

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[randomIndex];
    
    // We target rotation between 5 and 8 spins + segment center
    const targetDeg = 1800 + (360 - selectedPrize.deg);
    setRotation(targetDeg);

    setTimeout(() => {
      setSpinning(false);
      localStorage.setItem(`last_spun_${currentUser.email}`, todayStr);
      setLastSpunDate(todayStr);

      if (selectedPrize.type === 'balance') {
        onAddBalance(selectedPrize.value);
        alert(`Tebrikler!\nÇarktan ${selectedPrize.name} kazandınız! Hesabınıza yüklendi.`);
      } else if (selectedPrize.type === 'stars') {
        onAwardPrize('stars', selectedPrize.value);
        alert(`Tebrikler!\nÇarktan ${selectedPrize.name} kazandınız! Hesabınıza eklendi.`);
      } else {
        alert('Bugün şansınız yaver gitmedi, yarın tekrar deneyin!');
      }
    }, 4000);
  };

  return (
    <div className="profile-dashboard-container">
      {/* Welcome Banner */}
      <div className="profile-welcome-banner" style={{
        background: 'linear-gradient(135deg, var(--sb-dark-green) 0%, #112a23 100%)',
        borderRadius: '16px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '32px',
        boxShadow: 'var(--sb-shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            boxShadow: 'var(--sb-shadow-sm)'
          }}>
            {currentUser.avatar || '☕'}
          </div>
          <div>
            <h1 style={{ color: 'white', fontSize: '28px', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)', fontWeight: '700' }}>
              {currentUser.name}
            </h1>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>@{currentUser.username} • {currentUser.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '10px', color: 'var(--sb-light-green)' }}>
              <ShieldCheck size={16} />
              <span>Kolatan Üyesi (Doğrulanmış Hesap)</span>
            </div>
          </div>
        </div>

        {/* Member Star Badge */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '16px 24px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <span style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Üyelik Seviyesi</span>
          <h3 style={{ margin: '4px 0 0 0', color: 'var(--sb-light-green)', fontWeight: '600' }}>Gold Üye</h3>
        </div>
      </div>

      <div className="profile-dashboard-grid">
        {/* Wallet & Balance Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid var(--sb-border)',
            boxShadow: 'var(--sb-shadow-sm)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-dark-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} />
              <span>Kolatan Cüzdanım</span>
            </h3>

            <div style={{ 
              background: 'linear-gradient(135deg, #2b2b2b 0%, #151515 100%)',
              borderRadius: '12px',
              padding: '24px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '24px',
              boxShadow: 'var(--sb-shadow-md)'
            }}>
              {/* Card Decoration */}
              <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)' }}></div>
              <div style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '20px', opacity: 0.2 }}>KOLATAN CARD</div>
              
              <span style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase' }}>Kullanılabilir Bakiye</span>
              <h2 style={{ fontSize: '32px', margin: '4px 0 20px 0', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                ₺{(currentUser.balance || 0).toFixed(2)}
              </h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', opacity: 0.7 }}>
                <span>Kart Sahibi: {currentUser.name.toUpperCase()}</span>
                <span>★★★★ 5808</span>
              </div>
            </div>

            {/* Quick Balance Add Buttons */}
            <span style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '10px' }}>Hızlı Bakiye Yükle</span>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[50, 100, 200].map((amt) => (
                <button
                  key={amt}
                  className="sb-btn-outline"
                  style={{ flex: 1, padding: '10px', fontSize: '14px', borderRadius: '8px' }}
                  onClick={() => handleQuickAdd(amt)}
                >
                  +₺{amt}
                </button>
              ))}
            </div>

            {/* Custom Balance Add Form */}
            <form onSubmit={handleCustomAdd} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                placeholder="Özel Tutar (TL)"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid var(--sb-border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
              <button 
                type="submit" 
                className="sb-btn-solid" 
                style={{ padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>Yükle</span>
              </button>
            </form>
          </div>

          {/* Starbucks/Kolatan Rewards Stars */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid var(--sb-border)',
            boxShadow: 'var(--sb-shadow-sm)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-dark-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={20} fill="#cba258" stroke="#cba258" />
              <span>Yıldız Durumum</span>
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#cba258' }}>
                {currentUser.stars || 0}
              </div>
              <div>
                <strong style={{ fontSize: '14px', display: 'block' }}>Birikmiş Yıldız</strong>
                <span style={{ fontSize: '12px', color: 'var(--sb-text-muted)' }}>Her 10 TL alışverişe 1 Yıldız kazanırsınız.</span>
              </div>
            </div>

            {/* Stars Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span>Hediye İçecek İlerlemesi</span>
                <strong>{currentUser.stars || 0} / 15 Yıldız</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--sb-cream)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, ((currentUser.stars || 0) / 15) * 100)}%`,
                  backgroundColor: '#cba258',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--sb-text-muted)', display: 'block', marginTop: '8px', textAlign: 'right' }}>
                {(currentUser.stars || 0) >= 15 ? 'Tebrikler! 1 Bedava Tall boy kahveniz var!' : `Bedava kahve için ${Math.max(0, 15 - (currentUser.stars || 0))} Yıldız kaldı.`}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Wheel & Order History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '100%' }}>
          {/* Wheel of Fortune */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid var(--sb-border)',
            boxShadow: 'var(--sb-shadow-sm)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-dark-green)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <Award size={20} style={{ color: '#cba258' }} />
              <span>Hediye Çarkı</span>
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--sb-text-muted)', marginBottom: '10px' }}>Günde 1 kez çevirerek sürpriz hediyeler kazanın!</p>

            <div className="wheel-container">
              <div className="wheel-pointer"></div>
              <div 
                className="wheel" 
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(#006241 0deg 60deg, #cba258 60deg 120deg, #1e3932 120deg 180deg, #008248 180deg 240deg, #b2dfdb 240deg 300deg, #c5e1a5 300deg 360deg)'
                }}
              >
                {/* Segments Text Preview Overlay */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', fontSize: '9px', fontWeight: 'bold', color: 'white' }}>
                  <span style={{ position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%) rotate(0deg)' }}>+10₺</span>
                  <span style={{ position: 'absolute', right: '25px', top: '50%', transform: 'translateY(-50%) rotate(90deg)' }}>+2⭐</span>
                  <span style={{ position: 'absolute', bottom: '25px', left: '50%', transform: 'translateX(-50%) rotate(180deg)' }}>+20₺</span>
                  <span style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%) rotate(270deg)' }}>+5⭐</span>
                </div>
              </div>
            </div>

            <button
              className="sb-btn-solid"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: hasSpunToday ? '#cccccc' : 'var(--sb-green)',
                color: 'white',
                fontWeight: '600',
                cursor: hasSpunToday ? 'not-allowed' : 'pointer',
                marginTop: '12px'
              }}
              disabled={hasSpunToday || spinning}
              onClick={spinWheel}
            >
              {hasSpunToday ? 'Bugün Çarkı Çevirdiniz' : spinning ? 'Çark Dönüyor...' : 'Çarkı Çevir'}
            </button>
          </div>

          {/* Order History Section */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid var(--sb-border)',
            boxShadow: 'var(--sb-shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '400px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-dark-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} />
              <span>Son Siparişlerim</span>
            </h3>

            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '6px' }}>
              {orderHistory.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 0', color: 'var(--sb-text-muted)', gap: '10px' }}>
                  <ShoppingBag size={32} />
                  <span style={{ fontSize: '13px' }}>Henüz sipariş vermediniz.</span>
                </div>
              ) : (
                [...orderHistory].reverse().map((order, i) => (
                  <div 
                    key={i} 
                    style={{
                      border: '1px solid var(--sb-border)',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: 'var(--sb-card-bg)',
                      fontSize: '13px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--sb-dark)' }}>Sipariş #{orderHistory.length - i}</span>
                      <span style={{ color: 'var(--sb-green)' }}>₺{order.price.toFixed(2)}</span>
                    </div>
                    <div style={{ color: 'var(--sb-text-muted)', fontSize: '12px', marginBottom: '10px', lineHeight: '1.4' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx}>• {item.name} ({item.customizations.find(c => c.startsWith('Boy:')) || 'Grande'})</div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--sb-text-muted)', borderTop: '1px dashed var(--sb-border)', paddingTop: '8px' }}>
                      <span>{order.date}</span>
                      <span style={{ color: '#cba258', fontWeight: '600' }}>+{order.starsEarned} Yıldız</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
