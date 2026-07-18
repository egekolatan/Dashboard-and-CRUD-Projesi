import React, { useState } from 'react';
import { MapPin, Clock, Phone, Search, Coffee, Compass, Check } from 'lucide-react';
import MapComponent from './MapComponent';

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
    hours: '08:00 - 23:00',
    district: 'Konak',
    features: ['Deniz Kenarı', 'Açık Alan', 'Kablosuz İnternet'],
    coords: '38.4236, 27.1281'
  },
  {
    id: 6,
    name: 'Kolatan Mavibahçe',
    address: 'Mavibahçe AVM, Caher Dudayev Bulvarı, Mavişehir, Karşıyaka/İzmir',
    phone: '+90 232 502 1010',
    hours: '10:00 - 22:00',
    district: 'Karşıyaka',
    features: ['Açık Alan', 'Kablosuz İnternet', 'AVM Otoparkı'],
    coords: '38.4608, 27.0894'
  },
  {
    id: 7,
    name: 'Kolatan Urla Kekliktepe',
    address: 'Kekliktepe Mevkii, İzmir-Çeşme Yolu Üzeri, Urla/İzmir',
    phone: '+90 232 754 8877',
    hours: '07:00 - 00:00',
    district: 'Urla',
    features: ['Drive-Thru (Arabaya Servis)', 'Açık Alan', 'Geniş Otopark', 'Çocuk Oyun Alanı'],
    coords: '38.3189, 26.7865'
  },
  {
    id: 8,
    name: 'Kolatan Bornova Ege Üniversitesi',
    address: 'Gençlik Caddesi, Ege Üniversitesi Kampüsü, Bornova/İzmir',
    phone: '+90 232 388 9090',
    hours: '07:30 - 21:00',
    district: 'Bornova',
    features: ['Öğrenci Çalışma Alanı', 'Kablosuz İnternet', 'Açık Alan'],
    coords: '38.4632, 27.2185'
  }
];

export default function StoreLocator() {
  const [searchDistrict, setSearchDistrict] = useState('');
  const [selectedStore, setSelectedStore] = useState(IZMIR_STORES[0]);

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
            İzmir Şubelerimiz
          </h2>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-text-muted)' }} />
            <input
              type="text"
              placeholder="İlçe veya şube ara..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                border: '1px solid var(--sb-border)',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'var(--sb-card-bg)'
              }}
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
            />
          </div>
        </div>

        {/* Store List Scroll Area */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px 0' }}>
          {filteredStores.length === 0 ? (
            <div style={{ padding: '20px', textAlignment: 'center', color: 'var(--sb-text-muted)', fontSize: '14px' }}>
              Aramanızla eşleşen İzmir şubesi bulunamadı.
            </div>
          ) : (
            filteredStores.map(store => (
              <div
                key={store.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--sb-border)',
                  cursor: 'pointer',
                  backgroundColor: selectedStore.id === store.id ? 'var(--sb-cream)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                  borderLeft: selectedStore.id === store.id ? '4px solid var(--sb-green)' : '4px solid transparent'
                }}
                onClick={() => setSelectedStore(store)}
              >
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '15px', color: 'var(--sb-dark)', marginBottom: '4px' }}>
                  {store.name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--sb-text-muted)', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {store.address}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--sb-green)', fontWeight: '500' }}>
                  <Clock size={12} />
                  <span>Bugün: {store.hours}</span>
                </div>
              </div>
            ))
          )}
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
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--sb-green)', backgroundColor: 'var(--sb-light-green)', padding: '4px 8px', borderRadius: '4px' }}>
                    {selectedStore.district} Şubesi
                  </span>
                  <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', fontSize: '26px', color: 'var(--sb-dark-green)', marginTop: '8px', marginBottom: '4px' }}>
                    {selectedStore.name}
                  </h1>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--sb-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyAlignment: 'center', color: 'white', display: 'flex', justifyContent: 'center' }}>
                  <Compass size={24} style={{ alignSelf: 'center' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--sb-dark)', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={18} style={{ color: 'var(--sb-green)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{selectedStore.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} style={{ color: 'var(--sb-green)' }} />
                  <span>Çalışma Saatleri: <strong>{selectedStore.hours}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} style={{ color: 'var(--sb-green)' }} />
                  <span>Telefon: <a href={`tel:${selectedStore.phone}`} style={{ color: 'var(--sb-green)', fontWeight: '500' }}>{selectedStore.phone}</a></span>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '30px', boxShadow: 'var(--sb-shadow-sm)', border: '1px solid var(--sb-border)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: '600', fontSize: '16px', color: 'var(--sb-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coffee size={18} style={{ color: 'var(--sb-green)' }} />
                <span>Şube Özellikleri</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                {selectedStore.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--sb-text-muted)' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#eefcf7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sb-green)' }}>
                      <Check size={12} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Map visualization */}
            <div style={{
              height: '220px',
              backgroundColor: '#e3ece9',
              borderRadius: '12px',
              border: '1px dashed var(--sb-green)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--sb-dark-green)',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--sb-shadow-sm)'
            }}
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.name + ' ' + selectedStore.address)}`, '_blank')}
            >
              <MapPin size={32} />
              <strong style={{ fontSize: '14px' }}>Haritada Göster</strong>
              <span style={{ fontSize: '11px', color: 'var(--sb-text-muted)' }}>Google Haritalar ile dışarıda açmak için tıklayın ({selectedStore.coords})</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--sb-text-muted)' }}>
            Lütfen detaylarını incelemek için sol listeden bir İzmir şubesi seçin.
          </div>
        )}
      </div>
    </div>
  );
}
