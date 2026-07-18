import React, { useState } from 'react';
import { MapPin, Clock, Phone, Search, Coffee, Compass, Check } from 'lucide-react';
import MapComponent from './MapComponent';
import { translations } from '../services/translations';

const IZMIR_STORES = [
  {
    id: 1,
    name: 'Kolatan Alsancak Gündoğdu',
    address: 'Atatürk Caddesi No:184/A Gündoğdu Meydanı, Alsancak, Konak/İzmir',
    phone: '+90 232 464 1234',
    hours: '07:00 - 23:00',
    district: 'Konak',
    features: ['Açık Alan', 'Clover Demleme', 'Kablosuz İnternet', 'Mobil Ödeme'],
    coords: '38.4328, 27.1378'
  },
  {
    id: 2,
    name: 'Kolatan Karşıyaka Bostanlı',
    address: 'Cemal Gürsel Caddesi No:412, Bostanlı, Karşıyaka/İzmir',
    phone: '+90 232 362 5678',
    hours: '07:30 - 23:30',
    district: 'Karşıyaka',
    features: ['Açık Alan', 'Paket Servis', 'Kablosuz İnternet'],
    coords: '38.4552, 27.0984'
  },
  {
    id: 3,
    name: 'Kolatan Forum Bornova',
    address: 'Forum Bornova AVM, Kazımdirik Mahallesi 372. Sokak, Bornova/İzmir',
    phone: '+90 232 396 0123',
    hours: '10:00 - 22:00',
    district: 'Bornova',
    features: ['AVM Otoparkı', 'Açık Alan', 'Kablosuz İnternet', 'Mobil Ödeme'],
    coords: '38.4619, 27.2253'
  },
  {
    id: 4,
    name: 'Kolatan İstinyePark İzmir',
    address: 'İstinyePark İzmir AVM, Bahçelerarası Mahallesi, Balçova/İzmir',
    phone: '+90 232 290 8899',
    hours: '10:00 - 22:00',
    district: 'Balçova',
    features: ['Rezerv Kahve (Reserve)', 'Açık Alan', 'AVM Otoparkı', 'Mobil Ödeme'],
    coords: '38.4042, 27.0425'
  },
  {
    id: 5,
    name: 'Kolatan Konak Pier',
    address: 'Konak Pier AVM, Atatürk Caddesi No:19, Konak/İzmir',
    phone: '+90 232 489 4433',
    hours: '09:00 - 22:00',
    district: 'Konak',
    features: ['Deniz Kenarı', 'Açık Alan', 'Kablosuz İnternet'],
    coords: '38.4190, 27.1278'
  },
  {
    id: 6,
    name: 'Kolatan Urla Kekliktepe',
    address: 'Kekliktepe Mevkii, 8003. Sokak No:12, Urla/İzmir',
    phone: '+90 232 754 8877',
    hours: '08:00 - 23:00',
    district: 'Urla',
    features: ['Rezerv Kahve (Reserve)', 'Açık Alan', 'Clover Demleme', 'Kablosuz İnternet'],
    coords: '38.3315, 26.7912'
  },
  {
    id: 7,
    name: 'Kolatan Karşıyaka Mavibahçe',
    address: 'Mavibahçe AVM, Mavişehir, Karşıyaka/İzmir',
    phone: '+90 232 324 0909',
    hours: '10:00 - 22:00',
    district: 'Karşıyaka',
    features: ['AVM Otoparkı', 'Açık Alan', 'Kablosuz İnternet'],
    coords: '38.4612, 27.0898'
  },
  {
    id: 8,
    name: 'Kolatan Ege Üniversitesi',
    address: 'Ege Üniversitesi Kampüsü, Bornova Metro Çıkışı, Bornova/İzmir',
    phone: '+90 232 388 1122',
    hours: '07:00 - 22:00',
    district: 'Bornova',
    features: ['Açık Alan', 'Paket Servis', 'Kablosuz İnternet', 'Mobil Ödeme'],
    coords: '38.4578, 27.2144'
  }
];

export default function StoreLocator({ lang }) {
  const [searchDistrict, setSearchDistrict] = useState('');
  const [selectedStore, setSelectedStore] = useState(IZMIR_STORES[0]);

  const t = translations[lang] || translations.tr;

  const getFeatureName = (feat) => {
    if (lang === 'tr') return feat;
    const mappings = {
      'Açık Alan': 'Outdoor Seating',
      'Clover Demleme': 'Clover Brewing',
      'Kablosuz İnternet': 'Free Wi-Fi',
      'Mobil Ödeme': 'Mobile Payment',
      'Paket Servis': 'Takeaway Service',
      'AVM Otoparkı': 'Mall Parking',
      'Rezerv Kahve (Reserve)': 'Reserve Coffee',
      'Deniz Kenarı': 'Seaside View'
    };
    return mappings[feat] || feat;
  };

  const filteredStores = IZMIR_STORES.filter(store => 
    store.name.toLowerCase().includes(searchDistrict.toLowerCase()) ||
    store.district.toLowerCase().includes(searchDistrict.toLowerCase()) ||
    store.address.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  return (
    <div className="store-locator-container">
      {/* Sidebar List */}
      <div className="store-locator-sidebar">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--sb-border)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '20px', marginBottom: '14px', color: 'var(--sb-dark-green)' }}>
            {t.storesTitle}
          </h2>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
            <input 
              type="text" 
              placeholder={t.searchStorePlaceholder}
              className="sb-search-input"
              style={{ width: '100%', paddingLeft: '38px', height: '40px', fontSize: '13px' }}
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
            />
          </div>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto' }}>
          {filteredStores.map(store => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '20px',
                borderBottom: '1px solid var(--sb-border)',
                backgroundColor: selectedStore?.id === store.id ? 'var(--sb-cream)' : 'transparent',
                display: 'flex',
                gap: '12px',
                transition: 'background-color 0.2s'
              }}
            >
              <MapPin size={20} style={{ color: selectedStore?.id === store.id ? 'var(--sb-green)' : 'var(--sb-text-muted)', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: selectedStore?.id === store.id ? 'var(--sb-green)' : 'inherit' }}>
                  {store.name}
                </h4>
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--sb-text-muted)', lineHeight: '1.4' }}>
                  {store.address}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--sb-text-muted)' }}>
                  <Clock size={12} />
                  <span>{store.hours}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Pane / Mock Map */}
      <div className="store-locator-detail">
        {selectedStore ? (
          <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            {/* Live Interactive Map */}
            <MapComponent stores={IZMIR_STORES} />

            {/* Header Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: 'var(--sb-shadow-sm)', border: '1px solid var(--sb-border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '22px', color: 'var(--sb-dark-green)', margin: '0 0 6px 0' }}>
                    {selectedStore.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--sb-text-muted)' }}>{selectedStore.address}</p>
                </div>
                <div style={{ backgroundColor: 'var(--sb-cream)', color: 'var(--sb-green)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  {selectedStore.district}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', borderTop: '1px solid var(--sb-border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <Clock size={16} style={{ color: 'var(--sb-green)' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', color: 'var(--sb-text-muted)', textTransform: 'uppercase' }}>{t.openHours}</strong>
                    <span>{selectedStore.hours}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <Phone size={16} style={{ color: 'var(--sb-green)' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', color: 'var(--sb-text-muted)', textTransform: 'uppercase' }}>{t.phone}</strong>
                    <span>{selectedStore.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: 'var(--sb-shadow-sm)', border: '1px solid var(--sb-border)' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '16px', color: 'var(--sb-dark-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coffee size={18} />
                <span>{t.features}</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {selectedStore.features.map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--sb-dark)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--sb-cream)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--sb-green)' }}>
                      <Check size={12} />
                    </div>
                    <span>{getFeatureName(feat)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Directions Button */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.name + ' ' + selectedStore.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sb-btn-solid"
              style={{ padding: '16px', textAlign: 'center', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <Compass size={18} />
              <span>{t.directions}</span>
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: 'var(--sb-text-muted)' }}>
            <MapPin size={48} />
            <p style={{ fontSize: '15px', fontWeight: '500' }}>
              {lang === 'tr' ? 'Detayları görmek için listeden bir şube seçin.' : 'Select a branch from the list to view details.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
