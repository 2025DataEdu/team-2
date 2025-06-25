
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SmallMapProps {
  latitude?: number | null;
  longitude?: number | null;
  className?: string;
  height?: string;
}

// Leaflet 기본 아이콘 설정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SmallMap = ({ latitude, longitude, className = '', height = '200px' }: SmallMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    // 기존 맵이 있으면 제거
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // 새 맵 생성
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    }).setView([latitude, longitude], 15);

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 마커 추가
    L.marker([latitude, longitude]).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500 text-sm">위치 정보 없음</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg border border-gray-200 ${className}`}
      style={{ height }}
    />
  );
};

export default SmallMap;
