import React from 'react';
import { CheckCircle, Calendar, Star, DollarSign, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, orderData, lang }) {
  if (!isOpen || !orderData) return null;

  const { total, starsEarned, id } = orderData;

  const isTr = lang === 'tr';

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--sb-bg)',
          color: 'var(--sb-dark)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          padding: '30px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid var(--sb-border)',
          position: 'relative',
          animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--sb-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>

        {/* Animated Check */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ 
            backgroundColor: 'rgba(0, 98, 65, 0.1)', 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            animation: 'pulseGreen 2s infinite'
          }}>
            <CheckCircle size={44} style={{ color: 'var(--sb-green)' }} />
          </div>
        </div>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '22px', color: 'var(--sb-dark-green)', margin: '0 0 10px 0' }}>
          {isTr ? 'Siparişiniz Alındı!' : 'Order Placed Successfully!'}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--sb-text-muted)', margin: '0 0 24px 0', lineHeight: '1.5' }}>
          {isTr 
            ? 'Kahve çekirdeklerimiz öğütülmeye ve bardağınız hazırlanmaya başladı. Afiyet olsun!' 
            : 'Our beans are grinding and your cup is being prepared. Enjoy!'}
        </p>

        {/* Order Details Card */}
        <div style={{ 
          backgroundColor: 'var(--sb-cream)', 
          borderRadius: '16px', 
          padding: '20px', 
          marginBottom: '24px',
          border: '1px solid var(--sb-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <span style={{ color: 'var(--sb-text-muted)', fontWeight: '500' }}>
              {isTr ? 'Sipariş Numarası' : 'Order Number'}
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', backgroundColor: 'var(--sb-bg)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--sb-border)', fontSize: '12px' }}>
              #{id || Math.floor(1000 + Math.random() * 9000)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <span style={{ color: 'var(--sb-text-muted)', fontWeight: '500' }}>
              {isTr ? 'Ödenen Tutar' : 'Amount Paid'}
            </span>
            <span style={{ fontWeight: '800', color: 'var(--sb-dark-green)', fontSize: '15px' }}>
              ₺{total.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
            <span style={{ color: 'var(--sb-text-muted)', fontWeight: '500' }}>
              {isTr ? 'Kazanılan Yıldız' : 'Stars Earned'}
            </span>
            <span style={{ fontWeight: '700', color: '#ffb300', display: 'flex', alignItems: 'center', gap: '4px' }}>
              +{starsEarned} <Star size={16} fill="#ffb300" stroke="#ffb300" />
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="sb-btn-solid" 
          onClick={onClose}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold' }}
        >
          {isTr ? 'Kapat ve Siparişi Takip Et' : 'Close & Track Order'}
        </button>
      </div>
    </div>
  );
}
