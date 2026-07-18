import React, { useState } from 'react';
import { X, ShoppingBag, Check, Percent } from 'lucide-react';
import { ProductImage } from './ProductCard';
import { translations } from '../services/translations';

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onClearCart, onCheckout, lang }) {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const t = translations[lang] || translations.tr;

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
      setCouponError(lang === 'tr' ? 'Geçersiz indirim kuponu!' : 'Invalid promo code!');
    }
  };

  const handleCheckoutClick = () => {
    onCheckout(total).then((success) => {
      if (success) {
        setAppliedCoupon('');
        setDiscountPercent(0);
        setFreeDelivery(false);
        onClose();
      }
    });
  };

  return (
    <>
      <div className="sb-cart-overlay" onClick={onClose}></div>
      <div className="sb-cart-drawer">
        <div className="sb-cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} className="sb-green-icon" />
            <h2 className="sb-cart-title">{t.sepetim}</h2>
            <span style={{ fontSize: '14px', backgroundColor: 'var(--sb-cream)', color: 'var(--sb-green)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
              {cartItems.length}
            </span>
          </div>
          <button className="sb-cart-close" onClick={onClose} aria-label="Kapat">
            <X size={24} />
          </button>
        </div>

        <div className="sb-cart-body">
          {cartItems.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: 'var(--sb-text-muted)' }}>
              <div style={{ fontSize: '48px' }}>🛍️</div>
              <p style={{ fontSize: '15px', fontWeight: '500' }}>
                {lang === 'tr' ? 'Sepetiniz henüz boş.' : 'Your bag is empty.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={onClearCart} 
                  style={{ fontSize: '13px', color: '#c62828', fontWeight: '600', textDecoration: 'underline' }}
                >
                  {t.clearCart}
                </button>
              </div>

              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--sb-border)', paddingBottom: '16px', position: 'relative' }}>
                  <div style={{ width: '70px', height: '70px', backgroundColor: 'var(--sb-cream)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ProductImage type={item.type} color={item.color} size="50px" />
                  </div>
                  <div style={{ flexGrow: 1, paddingRight: '20px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{item.name}</h4>
                    <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--sb-text-muted)', lineHeight: '1.4' }}>
                      {lang === 'tr' ? 'Boy' : 'Size'}: {item.customizations.size} • {item.customizations.shots} Shot Espresso ({item.customizations.decaf})
                      {item.customizations.milk && ` • ${item.customizations.milk}`}
                      {item.customizations.syrups.caramel > 0 && ` • ${item.customizations.syrups.caramel} Karamel`}
                      {item.customizations.syrups.vanilla > 0 && ` • ${item.customizations.syrups.vanilla} Vanilya`}
                      {item.customizations.syrups.hazelnut > 0 && ` • ${item.customizations.syrups.hazelnut} Fındık`}
                    </p>
                    <span style={{ fontWeight: 'bold', color: 'var(--sb-green)', fontSize: '14px' }}>₺{item.price.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(idx)}
                    style={{ position: 'absolute', right: 0, top: 0, color: '#c62828' }}
                    aria-label="Ürünü çıkar"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="sb-cart-footer">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder={t.couponPlaceholder}
                className="sb-search-input"
                style={{ flexGrow: 1, height: '40px', fontSize: '13px' }}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="submit" className="sb-btn-solid" style={{ height: '40px', padding: '0 16px', fontSize: '13px' }}>
                {t.applyBtn}
              </button>
            </form>

            {couponError && <p style={{ color: '#d32f2f', fontSize: '12px', margin: '-10px 0 10px 0', fontWeight: '500' }}>{couponError}</p>}
            {appliedCoupon && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sb-green)', fontSize: '13px', fontWeight: '600', marginBottom: '14px' }}>
                <Check size={16} />
                <span>{appliedCoupon} {lang === 'tr' ? 'Kuponu Uygulandı' : 'Coupon Applied'} ({discountPercent > 0 ? `%${discountPercent} indirim` : (lang === 'tr' ? 'Ücretsiz kurye' : 'Free delivery')})</span>
              </div>
            )}

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', marginBottom: '20px', borderBottom: '1px dashed var(--sb-border)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t.subtotal}</span>
                <span>₺{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c62828' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Percent size={14} />
                    <span>{lang === 'tr' ? 'İndirim' : 'Discount'}</span>
                  </span>
                  <span>-₺{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{t.deliveryFee}</span>
                <span>{deliveryFee === 0 ? t.free : `₺${deliveryFee.toFixed(2)}`}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{t.total}</span>
              <span style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--sb-dark-green)' }}>₺{total.toFixed(2)}</span>
            </div>

            <button className="sb-btn-solid" style={{ width: '100%', padding: '14px', fontSize: '15px' }} onClick={handleCheckoutClick}>
              {t.checkoutBtn}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
