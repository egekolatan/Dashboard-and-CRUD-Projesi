import React from 'react';
import { Plus } from 'lucide-react';

// Custom component to render beautiful vector coffee cup SVGs dynamically
export function ProductImage({ type, color, size = "100%" }) {
  // Common colors
  const liquidColor = color || "#4e3629"; // Default coffee brown
  
  if (type === 'cold' || type === 'frappuccino') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'all 0.3s ease' }}>
        {/* Straw */}
        <path d="M58 5 L68 25" stroke="#00704A" strokeWidth="4" strokeLinecap="round" />
        
        {/* Whipped Cream for Frappuccino */}
        {type === 'frappuccino' && (
          <path d="M30 40 C30 25, 40 20, 50 20 C60 20, 70 25, 70 40 Z" fill="#FFF8F0" />
        )}
        
        {/* Lid */}
        <path d="M26 38 H74 C76 38, 78 40, 78 42 C78 44, 76 46, 74 46 H26 C24 46, 22 44, 22 42 C22 40, 24 38, 26 38 Z" fill="#EAEAEA" stroke="#D5D5D5" strokeWidth="1" />
        
        {/* Cup Liquid */}
        <path d="M28 46 L34 100 C34.5 106, 39.5 110, 45 110 H55 C60.5 110, 65.5 106, 66 L100 46 H28 Z" fill={liquidColor} opacity="0.9" />
        
        {/* Glass Cup Outline */}
        <path d="M27 46 L33.5 102 C34 106.5 38 110 42.5 110 H57.5 C62 110 66 106.5 66.5 102 L73 46" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Ice Cubes */}
        {type === 'cold' && (
          <>
            <rect x="38" y="55" width="10" height="10" rx="2" transform="rotate(15 38 55)" fill="#FFFFFF" opacity="0.6" />
            <rect x="52" y="65" width="10" height="10" rx="2" transform="rotate(-10 52 65)" fill="#FFFFFF" opacity="0.6" />
            <rect x="42" y="80" width="10" height="10" rx="2" transform="rotate(45 42 80)" fill="#FFFFFF" opacity="0.6" />
          </>
        )}
        
        {/* Starbucks Green Medallion */}
        <circle cx="50" cy="78" r="13" fill="#006241" />
        <circle cx="50" cy="78" r="11" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2,2" />
        <text x="50" y="82" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">★</text>
      </svg>
    );
  }

  if (type === 'tea') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tea Tag String */}
        <path d="M62 30 C65 20, 75 25, 78 15" stroke="#D5D5D5" strokeWidth="1.5" />
        <rect x="74" y="8" width="8" height="10" rx="1" fill="#FF5252" transform="rotate(5 74 8)" />
        
        {/* Cup */}
        <path d="M26 35 L33.5 102 C34 106.5 38 110 42.5 110 H57.5 C62 110 66 106.5 66.5 102 L74 35 H26 Z" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
        
        {/* Lid */}
        <path d="M23 30 H77 C79 30, 80 32, 80 34 C80 36, 79 37, 77 37 H23 C21 37, 20 36, 20 34 C20 32, 21 30, 23 30 Z" fill="#F4F4F4" stroke="#D5D5D5" strokeWidth="1" />
        
        {/* Sleeve */}
        <path d="M29 55 L31 78 H69 L71 55 H29 Z" fill="#D2B48C" opacity="0.8" />
        
        {/* Starbucks Logo Print on Sleeve */}
        <circle cx="50" cy="66" r="9" fill="#006241" />
        <text x="50" y="69" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">★</text>
      </svg>
    );
  }

  if (type === 'bakery') {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Plate */}
        <ellipse cx="60" cy="75" rx="50" ry="25" fill="#F4F4F4" stroke="#EAEAEA" strokeWidth="2" />
        <ellipse cx="60" cy="75" rx="42" ry="19" fill="#FFFFFF" />
        
        {/* Croissant / Bakery item */}
        <path d="M38 72 C36 62, 50 50, 60 50 C70 50, 84 62, 82 72 C80 82, 70 80, 60 80 C50 80, 40 82, 38 72 Z" fill="#D2691E" stroke="#8B4513" strokeWidth="1" />
        <path d="M48 62 C46 58, 52 55, 55 58" stroke="#CD853F" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 58 C56 54, 62 51, 65 54" stroke="#CD853F" strokeWidth="2" strokeLinecap="round" />
        <path d="M68 62 C66 58, 72 55, 75 58" stroke="#CD853F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Default Hot Cup ('hot')
  return (
    <svg width={size} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'all 0.3s ease' }}>
      {/* Cup Body */}
      <path d="M26 35 L33.5 102 C34 106.5 38 110 42.5 110 H57.5 C62 110 66 106.5 66.5 102 L74 35 H26 Z" fill="#FFFFFF" stroke="#E5E5E5" strokeWidth="2" />
      
      {/* Sleek Lid */}
      <path d="M23 30 H77 C79 30, 80 32, 80 34 C80 36, 79 37, 77 37 H23 C21 37, 20 36, 20 34 C20 32, 21 30, 23 30 Z" fill="#FFF8F0" stroke="#D5D5D5" strokeWidth="1" />
      <path d="M42 27 H58 C59 27, 60 28, 60 30 H40 C40 28, 41 27, 42 27 Z" fill="#FFF8F0" />
      
      {/* Cardboard Sleeve */}
      <path d="M29 55 L31 78 H69 L71 55 H29 Z" fill="#D2B48C" />
      
      {/* Starbucks Logo Print on Sleeve */}
      <circle cx="50" cy="66" r="9" fill="#006241" />
      <text x="50" y="69" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">★</text>
      
      {/* Smoke lines */}
      <path d="M42 16 Q45 10 42 4" stroke="#D5D5D5" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M50 18 Q53 12 50 6" stroke="#D5D5D5" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M58 17 Q61 11 58 5" stroke="#D5D5D5" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export default function ProductCard({ product, onSelect }) {
  return (
    <div className="sb-product-card" onClick={() => onSelect(product)}>
      <div className="sb-product-img-wrapper">
        <ProductImage type={product.type} color={product.color} size="85%" />
        {product.isNew && <span className="sb-product-badge">Yeni</span>}
      </div>
      <div className="sb-product-info">
        <h3 className="sb-product-name">{product.name}</h3>
        <p className="sb-product-desc">{product.description}</p>
        <div className="sb-product-footer">
          <div className="sb-product-details">
            <span className="sb-product-price">₺{product.price.toFixed(2)}</span>
            <span className="sb-product-cal">{product.calories} kcal</span>
          </div>
          <button 
            className="sb-btn-add" 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            aria-label={`${product.name} Kişiselleştir`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
