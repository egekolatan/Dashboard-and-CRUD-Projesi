import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, Star, Send } from 'lucide-react';
import { ProductImage } from './ProductCard';

export default function CustomizeModal({ product, onClose, onAddToBag }) {
  const [activeSubTab, setActiveSubTab] = useState('customize'); // 'customize' or 'reviews'
  const [size, setSize] = useState('Grande'); // Tall, Grande, Venti
  const [shots, setShots] = useState(2);
  const [decaf, setDecaf] = useState('Regular'); // Regular, Decaf
  const [milk, setMilk] = useState('Tam Yağlı Süt');
  const [caramelSyrup, setCaramelSyrup] = useState(0);
  const [vanillaSyrup, setVanillaSyrup] = useState(0);
  const [hazelnutSyrup, setHazelnutSyrup] = useState(0);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

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

  // Calculate pricing & calories based on options
  const sizeMultiplier = size === 'Tall' ? 0.85 : size === 'Venti' ? 1.2 : 1;
  const sizePriceDiff = size === 'Tall' ? -5 : size === 'Venti' ? 10 : 0;
  
  const shotPrice = (shots - (product.defaultShots || 0)) > 0 
    ? (shots - (product.defaultShots || 0)) * 12 
    : 0;

  const milkPrice = (milk !== 'Yarım Yağlı Süt' && milk !== 'Sütsüz' && milk !== 'Tam Yağlı Süt') ? 15 : 0;
  const syrupPrice = (caramelSyrup + vanillaSyrup + hazelnutSyrup) * 8;

  const finalPrice = Math.max(15, (product.price + sizePriceDiff + shotPrice + milkPrice + syrupPrice));
  const finalCalories = Math.round(product.calories * sizeMultiplier + (caramelSyrup + vanillaSyrup + hazelnutSyrup) * 45);

  const handleAdd = () => {
    const customizations = [];
    customizations.push(`Boy: ${size}`);
    if (product.defaultShots > 0) {
      customizations.push(`${shots} Shot Espresso (${decaf})`);
    }
    if (product.hasMilk) {
      customizations.push(`Süt: ${milk}`);
    }
    if (caramelSyrup > 0) customizations.push(`${caramelSyrup} Pompa Karamel Şurubu`);
    if (vanillaSyrup > 0) customizations.push(`${vanillaSyrup} Pompa Vanilya Şurubu`);
    if (hazelnutSyrup > 0) customizations.push(`${hazelnutSyrup} Pompa Fındık Şurubu`);

    onAddToBag({
      id: product.id,
      name: product.name,
      price: finalPrice,
      calories: finalCalories,
      type: product.type,
      color: product.color,
      customizations,
    });
    onClose();
  };

  const handlePostReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev = {
      author: 'Siz (Kolatan Üyesi)',
      rating: newRating,
      text: newComment,
      date: new Date().toLocaleDateString('tr-TR')
    };

    const updated = [...reviews, newRev];
    setReviews(updated);
    localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));
    setNewComment('');
    setNewRating(5);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="sb-modal-overlay" onClick={onClose}>
      <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sb-modal-close" onClick={onClose} aria-label="Kapat">
          <X size={20} />
        </button>

        <div className="sb-modal-left">
          <ProductImage type={product.type} color={product.color} size="75%" />
          <span className="sb-modal-cal-large">{finalCalories} kcal</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', background: 'rgba(255,255,255,0.7)', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            <Star size={16} fill="#cba258" stroke="#cba258" />
            <span>{averageRating} / 5.0 ({reviews.length} Yorum)</span>
          </div>
        </div>

        <div className="sb-modal-right">
          {/* Sub Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--sb-border)', backgroundColor: 'var(--sb-cream)' }}>
            <button 
              onClick={() => setActiveSubTab('customize')} 
              style={{ flex: 1, padding: '14px', fontWeight: 'bold', fontSize: '13px', color: activeSubTab === 'customize' ? 'var(--sb-green)' : 'var(--sb-text-muted)', borderBottom: activeSubTab === 'customize' ? '3px solid var(--sb-green)' : 'none', textTransform: 'uppercase' }}
            >
              Kişiselleştir
            </button>
            <button 
              onClick={() => setActiveSubTab('reviews')} 
              style={{ flex: 1, padding: '14px', fontWeight: 'bold', fontSize: '13px', color: activeSubTab === 'reviews' ? 'var(--sb-green)' : 'var(--sb-text-muted)', borderBottom: activeSubTab === 'reviews' ? '3px solid var(--sb-green)' : 'none', textTransform: 'uppercase' }}
            >
              Kullanıcı Yorumları ({reviews.length})
            </button>
          </div>

          <div className="sb-modal-content-scroll" style={{ display: activeSubTab === 'customize' ? 'block' : 'none' }}>
            <h2 className="sb-modal-title">{product.name}</h2>
            <p className="sb-modal-desc">{product.description}</p>

            {/* Size Section */}
            <h3 className="sb-section-title">Boy Seçimi</h3>
            <div className="sb-sizes-row">
              {[
                { name: 'Tall', vol: '354 ml' },
                { name: 'Grande', vol: '473 ml' },
                { name: 'Venti', vol: '591 ml' },
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
                <h3 className="sb-section-title">Süt Seçimi</h3>
                <div style={{ marginBottom: '24px' }}>
                  <select 
                    className="sb-select-custom" 
                    value={milk} 
                    onChange={(e) => setMilk(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Yarım Yağlı Süt">Yarım Yağlı Süt (Standart)</option>
                    <option value="Tam Yağlı Süt">Tam Yağlı Süt</option>
                    <option value="Yağsız Süt">Yağsız Süt</option>
                    <option value="Soya Sütü">Soya Sütü (+15 TL)</option>
                    <option value="Badem Sütü">Badem Sütü (+15 TL)</option>
                    <option value="Yulaf Sütü">Yulaf Sütü (+15 TL)</option>
                  </select>
                </div>
              </>
            )}

            {/* Espresso Options */}
            {product.defaultShots > 0 && (
              <>
                <h3 className="sb-section-title">Espresso & Kafein</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  <div className="sb-customizer-item">
                    <span className="sb-customizer-label">Espresso Shot Sayısı</span>
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
                    <span className="sb-customizer-label">Kafein Türü</span>
                    <select className="sb-select-custom" value={decaf} onChange={(e) => setDecaf(e.target.value)}>
                      <option value="Regular">Normal Kafein</option>
                      <option value="Decaf">Kafeinsiz (Decaf)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Syrup Options */}
            <h3 className="sb-section-title">Ekstra Şuruplar (+8 TL / Pompa)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '10px' }}>
              <div className="sb-customizer-item">
                <span className="sb-customizer-label">Karamel Şurubu</span>
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
                <span className="sb-customizer-label">Vanilya Şurubu</span>
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
                <span className="sb-customizer-label">Fındık Şurubu</span>
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
          </div>

          {/* Reviews Sub-View */}
          <div className="sb-modal-content-scroll" style={{ display: activeSubTab === 'reviews' ? 'block' : 'none' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '18px', color: 'var(--sb-dark-green)', marginBottom: '16px' }}>
              Değerlendirmeler ({reviews.length})
            </h3>
            
            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '280px', overflowY: 'auto', marginBottom: '24px', paddingRight: '6px' }}>
              {reviews.map((rev, i) => (
                <div key={i} style={{ border: '1px solid var(--sb-border)', borderRadius: '8px', padding: '12px', background: 'var(--sb-card-bg)', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong>{rev.author}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--sb-text-muted)' }}>{rev.date}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', color: '#cba258', marginBottom: '6px' }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={12} fill={idx < rev.rating ? '#cba258' : 'none'} stroke="#cba258" />
                    ))}
                  </div>
                  <p style={{ margin: 0, color: 'var(--sb-dark)', lineHeight: '1.4' }}>{rev.text}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostReview} style={{ borderTop: '1px dashed var(--sb-border)', paddingTop: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '8px' }}>Görüşünüzü Bildirin</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px' }}>Puanınız:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setNewRating(stars)}
                      style={{ color: '#cba258' }}
                    >
                      <Star size={16} fill={stars <= newRating ? '#cba258' : 'none'} stroke="#cba258" />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Bu içecek hakkındaki fikriniz..."
                  className="sb-search-input"
                  style={{ borderRadius: '8px', background: 'white', flex: 1 }}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="sb-btn-solid" style={{ borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Modal Footer (only visible when in customize mode) */}
          {activeSubTab === 'customize' && (
            <div className="sb-modal-footer">
              <div className="sb-modal-price-label">
                <span className="sb-modal-price-title">Toplam Tutar</span>
                <span className="sb-modal-price-val">₺{finalPrice.toFixed(2)}</span>
              </div>
              <button className="sb-modal-add-btn" onClick={handleAdd}>
                Sepete Ekle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
