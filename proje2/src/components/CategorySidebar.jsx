import React from 'react';

export default function CategorySidebar({ categories, activeCategory, onSelectCategory, isOpen, onClose }) {
  return (
    <aside className={`sb-sidebar ${isOpen ? 'open' : ''}`}>
      <h2 className="sb-sidebar-title">Kategoriler</h2>
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
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
