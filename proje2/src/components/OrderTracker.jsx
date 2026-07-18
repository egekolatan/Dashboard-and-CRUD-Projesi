import React, { useState, useEffect } from 'react';
import { Coffee, Motorbike, CheckCircle, Clock, X } from 'lucide-react';
import { translations } from '../services/translations';

export default function OrderTracker({ lang, activeOrder, onClose }) {
  const [step, setStep] = useState(0); // 0: Received, 1: Preparing, 2: On the Way, 3: Delivered
  const t = translations[lang] || translations.tr;

  useEffect(() => {
    if (!activeOrder) return;
    setStep(0);

    const timer1 = setTimeout(() => setStep(1), 6000);   // -> Preparing
    const timer2 = setTimeout(() => setStep(2), 12000);  // -> On Way
    const timer3 = setTimeout(() => setStep(3), 18000);  // -> Delivered

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeOrder]);

  if (!activeOrder) return null;

  const stepsInfo = [
    { label: t.statusReceived, desc: t.statusReceivedDesc, icon: <Clock size={20} /> },
    { label: t.statusPreparing, desc: t.statusPreparingDesc, icon: <Coffee size={20} /> },
    { label: t.statusOnWay, desc: t.statusOnWayDesc, icon: <Motorbike size={20} /> },
    { label: t.statusDelivered, desc: t.statusDeliveredDesc, icon: <CheckCircle size={20} /> }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '350px',
      backgroundColor: 'var(--sb-bg)',
      color: 'var(--sb-dark)',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      border: '1px solid var(--sb-border)',
      padding: '20px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'var(--font-body)',
      animation: 'slideUp 0.3s cubic-bezier(0.1, 0.8, 0.1, 1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '15px', color: 'var(--sb-green)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Coffee size={18} style={{ animation: step === 1 ? 'bounce 1s infinite' : 'none' }} />
          <span>{t.orderStatusTitle}</span>
        </h4>
        <button onClick={onClose} style={{ color: 'var(--sb-text-muted)', padding: '2px' }}>
          <X size={16} />
        </button>
      </div>

      {/* Progress Steps Indicators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '10px 0' }}>
        {/* Progress bar line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          right: '10px',
          height: '4px',
          backgroundColor: 'var(--sb-border)',
          transform: 'translateY(-50%)',
          zIndex: 1
        }}>
          <div style={{
            height: '100%',
            backgroundColor: 'var(--sb-green)',
            width: `${(step / 3) * 100}%`,
            transition: 'width 0.8s ease-out'
          }}></div>
        </div>

        {/* Steps circle */}
        {stepsInfo.map((s, idx) => {
          const isActive = idx <= step;
          const isCurrent = idx === step;
          return (
            <div key={idx} style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isActive ? 'var(--sb-green)' : 'var(--sb-card-bg)',
              border: `2px solid ${isActive ? 'var(--sb-green)' : 'var(--sb-border)'}`,
              color: isActive ? '#ffffff' : 'var(--sb-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              transition: 'all 0.3s ease',
              transform: isCurrent ? 'scale(1.15)' : 'none',
              boxShadow: isCurrent ? '0 0 10px rgba(0,98,65,0.4)' : 'none'
            }}>
              {s.icon}
            </div>
          );
        })}
      </div>

      {/* Active step detail */}
      <div style={{ textAlign: 'center', padding: '0 10px' }}>
        <h5 style={{ margin: '0 0 4px 0', fontWeight: '700', fontSize: '14px' }}>
          {stepsInfo[step].label}
        </h5>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--sb-text-muted)', lineHeight: '1.4' }}>
          {stepsInfo[step].desc}
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
