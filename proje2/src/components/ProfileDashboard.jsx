import React, { useState, useEffect } from 'react';
import { CreditCard, Award, History, ArrowRight, ShieldCheck } from 'lucide-react';
import { translations } from '../services/translations';
import { playTickSound, playWinSound } from '../services/audioService';

const PRIZES = [
  { name: '10 TL Bakiye', value: 10, type: 'balance', color: '#006241' },
  { name: '20 TL Bakiye', value: 20, type: 'balance', color: '#1e3932' },
  { name: '50 TL Bakiye', value: 50, type: 'balance', color: '#cba258' },
  { name: '2 Yıldız', value: 2, type: 'stars', color: '#a27a3c' },
  { name: '5 Yıldız', value: 5, type: 'stars', color: '#ffb300' },
  { name: 'Pas (Tekrar Dene)', value: 0, type: 'nothing', color: '#d32f2f' }
];

export default function ProfileDashboard({ currentUser, onAddBalance, orderHistory, onAwardPrize, lang }) {
  const [customAmount, setCustomAmount] = useState('');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastSpunDate, setLastSpunDate] = useState(() => localStorage.getItem(`last_spun_${currentUser.email}`) || '');

  const t = translations[lang] || translations.tr;

  // Star Progress calculations
  const stars = currentUser.stars || 0;
  const starsNeeded = 15;
  const progressPercent = Math.min(100, (stars / starsNeeded) * 100);

  const handleCustomAdd = (e) => {
    e.preventDefault();
    const amt = parseFloat(customAmount);
    if (!isNaN(amt) && amt > 0) {
      onAddBalance(amt);
      setCustomAmount('');
    }
  };

  const handleSpinWheel = () => {
    const todayStr = new Date().toDateString();
    if (lastSpunDate === todayStr) {
      alert(t.spunAlready);
      return;
    }

    if (isSpinning) return;
    setIsSpinning(true);

    // Pick a random prize index
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const selectedPrize = PRIZES[prizeIndex];

    // Compute rotation angles: 3 full spins (1080 deg) + prize angle offset
    const segmentAngle = 360 / PRIZES.length;
    const prizeOffset = (PRIZES.length - 1 - prizeIndex) * segmentAngle + (segmentAngle / 2);
    const targetRotation = wheelRotation + 1440 + prizeOffset - (wheelRotation % 360);

    setWheelRotation(targetRotation);

    // Play tick sounds at increasing intervals (simulating deceleration)
    const totalDuration = 4000;
    const ticksCount = 28;
    for (let i = 0; i < ticksCount; i++) {
      const progress = i / ticksCount;
      const easeOutTime = Math.pow(progress, 2.5) * totalDuration;
      setTimeout(() => {
        playTickSound();
      }, easeOutTime);
    }

    setTimeout(() => {
      setIsSpinning(false);
      localStorage.setItem(`last_spun_${currentUser.email}`, todayStr);
      setLastSpunDate(todayStr);

      // Play win sound when stopping
      playWinSound();

      if (selectedPrize.type === 'balance') {
        onAddBalance(selectedPrize.value);
        const prizeAlert = lang === 'tr'
          ? `Tebrikler!\nÇarktan ${selectedPrize.name} kazandınız! Hesabınıza yüklendi.`
          : `Congratulations!\nYou won ${selectedPrize.value} TL balance from the wheel! Added to your account.`;
        alert(prizeAlert);
      } else if (selectedPrize.type === 'stars') {
        onAwardPrize('stars', selectedPrize.value);
        const prizeAlert = lang === 'tr'
          ? `Tebrikler!\nÇarktan ${selectedPrize.name} kazandınız! Hesabınıza eklendi.`
          : `Congratulations!\nYou won ${selectedPrize.value} Stars from the wheel! Added to your rewards.`;
        alert(prizeAlert);
      } else {
        const passAlert = lang === 'tr'
          ? 'Bugün şansınız yaver gitmedi, yarın tekrar deneyin!'
          : 'Better luck tomorrow! Try again!';
        alert(passAlert);
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
              {t.welcome}, {currentUser.name}
            </h1>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>@{currentUser.username} • {currentUser.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '10px', color: 'var(--sb-light-green)' }}>
              <ShieldCheck size={16} />
              <span>{t.verifiedAccount}</span>
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
          <span style={{ fontSize: '12px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>{t.memberLevel}</span>
          <h3 style={{ margin: '4px 0 0 0', color: 'var(--sb-light-green)', fontWeight: '600' }}>{t.goldMember}</h3>
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
              <span>{t.walletTitle}</span>
            </h3>

            <div style={{ 
              backgroundColor: 'var(--sb-cream)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px',
              border: '1px solid var(--sb-border)'
            }}>
              <span style={{ fontSize: '14px', color: 'var(--sb-text-muted)', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                {lang === 'tr' ? 'Mevcut Cüzdan Bakiyesi' : 'Current Wallet Balance'}
              </span>
              <h2 style={{ fontSize: '38px', fontWeight: '800', color: 'var(--sb-dark-green)', margin: 0 }}>
                ₺{(currentUser.balance || 0).toFixed(2)}
              </h2>
            </div>

            {/* Quick Add Buttons */}
            <span style={{ fontSize: '12px', color: 'var(--sb-text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
              {t.quickAdd}
            </span>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[50, 100, 200].map((val) => (
                <button
                  key={val}
                  className="sb-btn-outline"
                  style={{ flex: 1, padding: '10px 0', fontSize: '14px' }}
                  onClick={() => onAddBalance(val)}
                >
                  +{val} TL
                </button>
              ))}
            </div>

            {/* Custom Amount Form */}
            <form onSubmit={handleCustomAdd} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                placeholder={t.customAmount}
                className="sb-search-input"
                style={{ flexGrow: 1 }}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="10"
                max="5000"
              />
              <button type="submit" className="sb-btn-solid" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px' }}>
                <span>{t.addBalance}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Starbucks Stars System */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid var(--sb-border)',
            boxShadow: 'var(--sb-shadow-sm)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-dark-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} />
              <span>Kolatan® Rewards Yıldızlarım</span>
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffb300' }}>★</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>{stars}</span>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--sb-text-muted)' }}>
                {stars} / {starsNeeded} {t.stars}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '8px', backgroundColor: 'var(--sb-border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ height: '100%', backgroundColor: 'var(--sb-green)', width: `${progressPercent}%`, borderRadius: '4px' }}></div>
            </div>

            <p style={{ margin: 0, fontSize: '12px', color: 'var(--sb-text-muted)', lineHeight: '1.5' }}>
              {lang === 'tr'
                ? `15 Yıldız biriktirdiğinizde 1 adet Tall boy ikram kahvenizi dilediğiniz şubemizden alabilirsiniz! (Kalan Yıldız: ${Math.max(0, starsNeeded - stars)})`
                : `Earn 15 Stars to get 1 Free Tall size coffee at any branch! (Remaining Stars: ${Math.max(0, starsNeeded - stars)})`}
            </p>
          </div>
        </div>

        {/* Wheel of Fortune & Order History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Daily Spin Wheel */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid var(--sb-border)',
            boxShadow: 'var(--sb-shadow-sm)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-dark-green)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Award size={20} style={{ color: '#ffb300' }} />
              <span>{t.spinWheelTitle}</span>
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--sb-text-muted)', margin: '0 0 20px 0' }}>
              {lang === 'tr' 
                ? 'Günde bir kez çevirerek sürpriz bakiye veya yıldız ödülleri kazanın!'
                : 'Spin once a day to win surprise balances or stars!'}
            </p>

            {/* Wheel Canvas Mock */}
            <div className="wheel-container">
              <div className="wheel-pointer"></div>
              <div 
                className="wheel" 
                style={{ 
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none'
                }}
              >
                {PRIZES.map((p, idx) => {
                  const angle = 360 / PRIZES.length;
                  return (
                    <div 
                      key={idx} 
                      className="wheel-segment" 
                      style={{ 
                        transform: `rotate(${idx * angle}deg)`,
                        backgroundColor: p.color
                      }}
                    >
                      <span className="wheel-text">{p.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              className="sb-btn-solid" 
              style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '10px' }} 
              onClick={handleSpinWheel}
              disabled={isSpinning}
            >
              {isSpinning ? (lang === 'tr' ? 'Dönüyor...' : 'Spinning...') : t.spinBtn}
            </button>
          </div>

          {/* Order History */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid var(--sb-border)',
            boxShadow: 'var(--sb-shadow-sm)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-dark-green)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} />
              <span>{t.orderHistoryTitle}</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
              {orderHistory.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--sb-text-muted)', fontSize: '14px', padding: '20px 0' }}>
                  {t.noOrdersYet}
                </p>
              ) : (
                orderHistory.map((order, idx) => (
                  <div key={idx} style={{ padding: '16px', border: '1px solid var(--sb-border)', borderRadius: '12px', backgroundColor: 'var(--sb-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--sb-text-muted)', marginBottom: '10px' }}>
                      <span>{order.date}</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--sb-green)' }}>+ {order.starsEarned} {t.stars}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{item.name} ({item.customizations.size})</span>
                          <span style={{ color: 'var(--sb-text-muted)' }}>x1</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--sb-border)', paddingTop: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                      <span>{t.total}</span>
                      <span>₺{order.price.toFixed(2)}</span>
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
