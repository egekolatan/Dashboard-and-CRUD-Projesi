import React, { useState } from 'react';
import { X, ShoppingBag, Check, Percent } from 'lucide-react';
import { ProductImage } from './ProductCard';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onClearCart, onCheckout }) {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  // Calculate delivery fee
  const standardDeliveryFee = subtotal > 150 || subtotal === 0 ? 0 : 25;
  const deliveryFee = freeDelivery ? 0 : standardDeliveryFee;

  // Calculate discount
  const discountAmount = subtotal * (discountPercent / 100);
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'KOLATAN20') {
      setDiscountPercent(20);
      setFreeDelivery(false);
      setAppliedCoupon(code);
      setCouponCode('');
    } else if (code === 'YILDIZ') {
      setFreeDelivery(true);
      setDiscountPercent(0);
      setAppliedCoupon(code);
      setCouponCode('');
    } else {
      setCouponError('Geçersiz indirim kuponu!');
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setFreeDelivery(false);
    setAppliedCoupon('');
    setCouponError('');
  };

  return (
    <>
      <div className="sb-cart-overlay" onClick={onClose}></div>
      <div className="sb-cart-drawer">
        <div className="sb-cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} />
            <h2 className="sb-cart-title" style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Sepetim</h2>
          </div>
          <button className="sb-cart-close" onClick={onClose} aria-label="Kapat">
            <X size={20} />
          </button>
        </div>

        <div className="sb-cart-items">
          {cartItems.length === 0 ? (
            <div className="sb-cart-empty">
              <ShoppingBag size={48} style={{ color: 'var(--sb-text-muted)', marginBottom: '16px' }} />
              <p>Sepetiniz henüz boş.</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="sb-cart-item">
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <ProductImage type={item.type} color={item.color} size="100%" />
                </div>
                <div className="sb-cart-item-details">
                  <h4 className="sb-cart-item-name">{item.name}</h4>
                  <div className="sb-cart-item-customs">
                    {item.customizations.join(' • ')}
                  </div>
                  <span className="sb-cart-item-price">₺{item.price.toFixed(2)}</span>
                </div>
                <button 
                  className="sb-cart-item-remove" 
                  onClick={() => onRemoveItem(index)}
                  aria-label="Ürünü Çıkar"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="sb-cart-summary">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px dashed var(--sb-border)', pb: '16px', paddingBottom: '16px' }}>
              <input
                type="text"
                placeholder="Kupon Kodu (KOLATAN20, YILDIZ)"
                className="sb-search-input"
                style={{ height: '36px', fontSize: '12px', paddingLeft: '14px', borderRadius: '8px', flex: 1, background: 'white' }}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button 
                type="submit" 
                className="sb-btn-solid" 
                style={{ padding: '0 14px', borderRadius: '8px', fontSize: '12px', height: '36px' }}
              >
                Uygula
              </button>
            </form>

            {couponError && (
              <div style={{ color: '#c62828', fontSize: '11px', fontWeight: '500', marginBottom: '10px' }}>
                {couponError}
              </div>
            )}

            {appliedCoupon && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#e8f5e9', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', color: '#2e7d32', fontWeight: '600', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Percent size={14} />
                  <span>Kupon Uygulandı: {appliedCoupon} ({discountPercent > 0 ? `%${discountPercent} İndirim` : 'Bedava Kurye'})</span>
                </div>
                <button type="button" onClick={handleRemoveCoupon} style={{ color: '#c62828', fontSize: '11px', textDecoration: 'underline' }}>Kaldır</button>
              </div>
            )}

            <div className="sb-cart-summary-row">
              <span>Ara Toplam</span>
              <span>₺{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="sb-cart-summary-row" style={{ color: '#2e7d32', fontWeight: '600' }}>
                <span>Kupon İndirimi</span>
                <span>-₺{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="sb-cart-summary-row">
              <span>Kurye Ücreti</span>
              <span>{deliveryFee === 0 ? 'Bedava' : `₺${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="sb-cart-total-row">
              <span>Toplam</span>
              <span>₺{total.toFixed(2)}</span>
            </div>
            <button 
              className="sb-cart-checkout-btn" 
              onClick={() => {
                const success = onCheckout(total);
                if (success) {
                  onClearCart();
                  handleRemoveCoupon();
                  onClose();
                }
              }}
            >
              Siparişi Onayla
            </button>
          </div>
        )}
      </div>
    </>
  );
}
