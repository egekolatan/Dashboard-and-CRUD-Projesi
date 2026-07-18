import React from 'react';

export default function CategorySidebar({ categories, activeCategory, onSelectCategory, isOpen, onClose, lang }) {
  const getCategoryName = (catId) => {
    const names = {
      all: lang === 'tr' ? 'Tüm Menü' : 'All Menu',
      'hot-coffee': lang === 'tr' ? 'Sıcak Kahveler' : 'Hot Coffees',
      'cold-coffee': lang === 'tr' ? 'Soğuk Kahveler' : 'Cold Coffees',
      matcha: lang === 'tr' ? 'Matcha Bölümü' : 'Matcha Section',
      frappuccino: 'Frappuccino®',
      tea: lang === 'tr' ? 'Sıcak & Soğuk Çaylar' : 'Hot & Iced Teas',
      bakery: lang === 'tr' ? 'Fırından & Yiyecek' : 'Bakery & Food'
    };
    return names[catId] || catId;
  };

  return (
    <aside className={`sb-sidebar ${isOpen ? 'open' : ''}`}>
      <h2 className="sb-sidebar-title">{lang === 'tr' ? 'Kategoriler' : 'Categories'}</h2>
      <ul className="sb-sidebar-list">
        {categories.map((category) => (
          <li 
            key={category.id} 
            className={`sb-sidebar-item ${activeCategory === category.id ? 'active' : ''}`}
          >
            <button onClick={() => {
              onSelectCategory(category.id);
              if (onClose) onClose();
            }}>
              {getCategoryName(category.id)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
