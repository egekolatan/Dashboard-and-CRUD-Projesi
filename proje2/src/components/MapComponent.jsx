import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom SVG coffee cup icon to bypass Vite resource loading bug
const coffeeIcon = L.divIcon({
  html: `<div style="background-color: #006241; border: 2px solid white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">☕</div>`,
  className: 'custom-leaflet-coffee-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

export default function MapComponent({ stores }) {
  const izmirCenter = [38.4237, 27.1428];

  // Coordinates for stores in Izmir
  const coordsMap = {
    'Alsancak Gündoğdu': [38.4357, 27.1384],
    'Bostanlı': [38.4552, 27.0988],
    'Forum Bornova': [38.4612, 27.2152],
    'İstinyePark': [38.3992, 27.0872],
    'Konak Pier': [38.4262, 27.1328],
    'Mavibahçe': [38.4578, 27.0924]
  };

  return (
    <div style={{ width: '100%', height: '420px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--sb-border)', boxShadow: 'var(--sb-shadow-sm)', marginBottom: '30px', position: 'relative', zIndex: 1 }}>
      <MapContainer 
        center={izmirCenter} 
        zoom={12} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stores.map((store) => {
          const latlng = coordsMap[store.name] || izmirCenter;
          return (
            <Marker key={store.id} position={latlng} icon={coffeeIcon}>
              <Popup>
                <div style={{ textAlign: 'left', minWidth: '160px', fontFamily: 'var(--font-body)' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontFamily: 'var(--font-heading)', color: 'var(--sb-green)', fontWeight: '700' }}>
                    Kolatan {store.name}
                  </h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#555', lineHeight: '1.4' }}>
                    {store.address}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {store.features.map((feat, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          fontSize: '9px', 
                          background: 'var(--sb-light-green)', 
                          color: 'var(--sb-dark-green)', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          fontWeight: '600' 
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
