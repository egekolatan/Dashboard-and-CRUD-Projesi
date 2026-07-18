import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Star, Send } from 'lucide-react';
import { ProductImage } from './ProductCard';
import { translations } from '../services/translations';

export default function CustomizeModal({ product, onClose, onAddToBag, lang }) {
  const [activeSubTab, setActiveSubTab] = useState('customize'); // 'customize' or 'reviews'
  const [size, setSize] = useState('Grande'); // Tall, Grande, Venti
  const [shots, setShots] = useState(2);
  const [decaf, setDecaf] = useState('Regular'); // Regular, Decaf
  const [milk, setMilk] = useState('Yarım Yağlı Süt');
  const [caramelSyrup, setCaramelSyrup] = useState(0);
  const [vanillaSyrup, setVanillaSyrup] = useState(0);
  const [hazelnutSyrup, setHazelnutSyrup] = useState(0);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const t = translations[lang] || translations.tr;

  // Sync state when product changes or modal opens
  useEffect(() => {
    if (product) {
      setShots(product.defaultShots || 0);
      setDecaf('Regular');
      setMilk(product.hasMilk ? 'Yarım Yağlı Süt' : 'Sütsüz');
      setSize('Grande');
      setCaramelSyrup(0);
      setVanillaSyrup(0);
      setHazelnutSyrup(0);
      setActiveSubTab('customize');

      // Load reviews
      const savedReviews = JSON.parse(localStorage.getItem(`reviews_${product.id}`) || '[]');
      if (savedReviews.length === 0) {
        // Pre-populate mock reviews
        const mockReviews = [
          { author: 'Ege K.', rating: 5, text: 'Tam kıvamında, harika bir lezzet! ☕', date: '18.07.2026' },
          { author: 'Selin Y.', rating: 4, text: 'Gayet güzel ama kreması biraz daha fazla olabilirdi.', date: '17.07.2026' }
        ];
        localStorage.setItem(`reviews_${product.id}`, JSON.stringify(mockReviews));
        setReviews(mockReviews);
      } else {
        setReviews(savedReviews);
      }
    }
  }, [product]);

  if (!product) return null;

  // Calculate pricing adjustments
  const sizeMultiplier = size === 'Tall' ? 0.9 : size === 'Grande' ? 1.0 : 1.15;
  const extraShots = Math.max(0, shots - (product.defaultShots || 0));
  const shotPrice = extraShots * 18;
  const milkPrice = (milk !== 'Yarım Yağlı Süt' && milk !== 'Sütsüz' && milk !== 'Tam Yağlı Süt') ? 15 : 0;
  const syrupPrice = (caramelSyrup + vanillaSyrup + hazelnutSyrup) * 12;

  const basePrice = product.price;
  const totalPrice = (basePrice * sizeMultiplier) + shotPrice + milkPrice + syrupPrice;
  const totalCalories = Math.round(product.calories * (size === 'Tall' ? 0.8 : size === 'Grande' ? 1.0 : 1.25));

  const handleAddClick = () => {
    const customizedItem = {
      ...product,
      price: totalPrice,
      calories: totalCalories,
      customizations: {
        size,
        shots,
        decaf: decaf === 'Decaf' ? (lang === 'tr' ? 'Kafeinsiz' : 'Decaf') : (lang === 'tr' ? 'Normal' : 'Regular'),
        milk: product.hasMilk ? milk : null,
        syrups: {
          caramel: caramelSyrup,
          vanilla: vanillaSyrup,
          hazelnut: hazelnutSyrup
        }
      }
    };
    onAddToBag(customizedItem);
    onClose();
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newReviewObj = {
      author: 'Siz',
      rating: newRating,
      text: newComment,
      date: new Date().toLocaleDateString()
    };

    const updated = [newReviewObj, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
    setNewComment('');
    setNewRating(5);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <>
      <div className="sb-modal-overlay" onClick={onClose}></div>
      <div className="sb-modal">
        {/* Modal Header */}
        <div className="sb-modal-header">
          <h2 className="sb-modal-title">{product.name}</h2>
          <button className="sb-modal-close" onClick={onClose} aria-label="Kapat">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--sb-border)', marginBottom: '20px' }}>
          <button 
            style={{
              flex: 1,
              padding: '12px',
              fontWeight: '600',
              borderBottom: activeSubTab === 'customize' ? '3px solid var(--sb-green)' : 'none',
              color: activeSubTab === 'customize' ? 'var(--sb-green)' : 'var(--sb-text-muted)',
              textAlign: 'center',
              fontSize: '14px'
            }}
            onClick={() => setActiveSubTab('customize')}
          >
            {t.customizeTab}
          </button>
          <button 
            style={{
              flex: 1,
              padding: '12px',
              fontWeight: '600',
              borderBottom: activeSubTab === 'reviews' ? '3px solid var(--sb-green)' : 'none',
              color: activeSubTab === 'reviews' ? 'var(--sb-green)' : 'var(--sb-text-muted)',
              textAlign: 'center',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onClick={() => setActiveSubTab('reviews')}
          >
            <span>{t.commentsTab}</span>
            <span style={{ backgroundColor: 'var(--sb-green)', color: 'white', fontSize: '11px', padding: '1px 6px', borderRadius: '10px' }}>
              {reviews.length}
            </span>
          </button>
        </div>

        {activeSubTab === 'customize' ? (
          /* CUSTOMIZE TAB */
          <div className="sb-modal-body" style={{ overflowY: 'auto', maxHeight: '60vh', paddingRight: '6px' }}>
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
              <div style={{ flex: '1 1 200px', backgroundColor: 'var(--sb-cream)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', minHeight: '180px' }}>
                <ProductImage type={product.type} color={product.color} size="150px" />
              </div>
              <div style={{ flex: '2 1 300px' }}>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--sb-text-muted)', lineHeight: '1.6' }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                  <span style={{ backgroundColor: 'var(--sb-border)', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                    {totalCalories} kcal
                  </span>
                  <span style={{ backgroundColor: 'var(--sb-border)', padding: '4px 8px', borderRadius: '4px', fontWeight: '500' }}>
                    {size} Size
                  </span>
                </div>
              </div>
            </div>

            {/* Size Options */}
            <h3 className="sb-section-title">{t.selectSize}</h3>
            <div className="sb-size-selector" style={{ marginBottom: '24px' }}>
              {[
                { name: 'Tall', vol: '354 ml' },
                { name: 'Grande', vol: '473 ml' },
                { name: 'Venti', vol: '591 ml' }
              ].map((s) => (
                <button
                  key={s.name}
                  className={`sb-size-btn ${size === s.name ? 'active' : ''}`}
                  onClick={() => setSize(s.name)}
                >
                  <span className="sb-size-icon-cup" style={{ fontSize: s.name === 'Tall' ? '14px' : s.name === 'Grande' ? '18px' : '22px' }}>
                    ☕
                  </span>
                  <span className="sb-size-name">{s.name}</span>
                  <span className="sb-size-vol">{s.vol}</span>
                </button>
              ))}
            </div>

            {/* Milk Options */}
            {product.hasMilk && (
              <>
                <h3 className="sb-section-title">{t.milkOption}</h3>
                <div style={{ marginBottom: '24px' }}>
                  <select 
                    className="sb-select-custom" 
                    value={milk} 
                    onChange={(e) => setMilk(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Yarım Yağlı Süt">{lang === 'tr' ? 'Yarım Yağlı Süt (Standart)' : '2% Reduced Fat Milk (Standard)'}</option>
                    <option value="Tam Yağlı Süt">{lang === 'tr' ? 'Tam Yağlı Süt' : 'Whole Milk'}</option>
                    <option value="Yağsız Süt">{lang === 'tr' ? 'Yağsız Süt' : 'Nonfat Milk'}</option>
                    <option value="Soya Sütü">{lang === 'tr' ? 'Soya Sütü (+15 TL)' : 'Soy Milk (+15 TL)'}</option>
                    <option value="Badem Sütü">{lang === 'tr' ? 'Badem Sütü (+15 TL)' : 'Almond Milk (+15 TL)'}</option>
                    <option value="Yulaf Sütü">{lang === 'tr' ? 'Yulaf Sütü (+15 TL)' : 'Oat Milk (+15 TL)'}</option>
                  </select>
                </div>
              </>
            )}

            {/* Espresso Options */}
            {product.defaultShots > 0 && (
              <>
                <h3 className="sb-section-title">{t.espressoOption}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div className="sb-customizer-item">
                    <span className="sb-customizer-label">{lang === 'tr' ? 'Espresso Shot Sayısı' : 'Espresso Shot Count'}</span>
                    <div className="sb-counter-control">
                      <button className="sb-counter-btn" onClick={() => setShots(Math.max(1, shots - 1))}>
                        <Minus size={14} />
                      </button>
                      <span className="sb-counter-value">{shots}</span>
                      <button className="sb-counter-btn" onClick={() => setShots(shots + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="sb-customizer-item">
                    <span className="sb-customizer-label">{t.caffeineOption}</span>
                    <select className="sb-select-custom" value={decaf} onChange={(e) => setDecaf(e.target.value)}>
                      <option value="Regular">{lang === 'tr' ? 'Normal Kafein' : 'Regular Caffeine'}</option>
                      <option value="Decaf">{lang === 'tr' ? 'Kafeinsiz (Decaf)' : 'Decaf (Decaf)'}</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Syrup Options */}
            {product.category !== 'bakery' && (
              <>
                <h3 className="sb-section-title">{t.syrupOption}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                  <div className="sb-customizer-item">
                    <span className="sb-customizer-label">{lang === 'tr' ? 'Karamel Şurubu (Pompa)' : 'Caramel Syrup (Pumps)'}</span>
                    <div className="sb-counter-control">
                      <button className="sb-counter-btn" onClick={() => setCaramelSyrup(Math.max(0, caramelSyrup - 1))}>
                        <Minus size={14} />
                      </button>
                      <span className="sb-counter-value">{caramelSyrup}</span>
                      <button className="sb-counter-btn" onClick={() => setCaramelSyrup(caramelSyrup + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="sb-customizer-item">
                    <span className="sb-customizer-label">{lang === 'tr' ? 'Vanilya Şurubu (Pompa)' : 'Vanilla Syrup (Pumps)'}</span>
                    <div className="sb-counter-control">
                      <button className="sb-counter-btn" onClick={() => setVanillaSyrup(Math.max(0, vanillaSyrup - 1))}>
                        <Minus size={14} />
                      </button>
                      <span className="sb-counter-value">{vanillaSyrup}</span>
                      <button className="sb-counter-btn" onClick={() => setVanillaSyrup(vanillaSyrup + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="sb-customizer-item">
                    <span className="sb-customizer-label">{lang === 'tr' ? 'Fındık Şurubu (Pompa)' : 'Hazelnut Syrup (Pumps)'}</span>
                    <div className="sb-counter-control">
                      <button className="sb-counter-btn" onClick={() => setHazelnutSyrup(Math.max(0, hazelnutSyrup - 1))}>
                        <Minus size={14} />
                      </button>
                      <span className="sb-counter-value">{hazelnutSyrup}</span>
                      <button className="sb-counter-btn" onClick={() => setHazelnutSyrup(hazelnutSyrup + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* REVIEWS TAB */
          <div className="sb-modal-body" style={{ overflowY: 'auto', maxHeight: '60vh', paddingRight: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: 'var(--sb-cream)', padding: '16px', borderRadius: '12px' }}>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--sb-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.averageRating}</span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sb-green)' }}>
                  {averageRating}
                  <span style={{ fontSize: '20px', color: '#ffb300' }}>★</span>
                </h4>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--sb-text-muted)' }}>
                {reviews.length} {lang === 'tr' ? 'Değerlendirme' : 'Reviews'}
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddReview} style={{ borderBottom: '1px solid var(--sb-border)', paddingBottom: '24px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>{t.writeComment}</h4>
              
              {/* Star Rating Select */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    style={{ color: star <= newRating ? '#ffb300' : 'var(--sb-border)', transition: 'transform 0.1s' }}
                  >
                    <Star fill={star <= newRating ? '#ffb300' : 'none'} size={24} />
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder={t.commentPlaceholder}
                  className="sb-search-input"
                  style={{ flexGrow: 1 }}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="sb-btn-solid" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
                  <Send size={16} />
                  <span>{t.submitComment}</span>
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--sb-text-muted)', fontSize: '14px', padding: '20px 0' }}>
                  {t.noCommentsYet}
                </p>
              ) : (
                reviews.map((r, idx) => (
                  <div key={idx} style={{ padding: '16px', border: '1px solid var(--sb-border)', borderRadius: '12px', backgroundColor: 'var(--sb-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '14px' }}>{r.author}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--sb-text-muted)' }}>{r.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', color: '#ffb300', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < r.rating ? '#ffb300' : 'none'} stroke={i < r.rating ? '#ffb300' : 'var(--sb-border)'} />
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: 'var(--sb-dark)' }}>
                      {r.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        {activeSubTab === 'customize' && (
          <div className="sb-modal-footer">
            <div>
              <span className="sb-total-label">{t.total}</span>
              <div className="sb-total-price">₺{totalPrice.toFixed(2)}</div>
            </div>
            <button className="sb-btn-solid" style={{ padding: '12px 30px' }} onClick={handleAddClick}>
              {t.addToBag}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
