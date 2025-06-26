
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { initializeLeafletIcons } from '../utils/leafletIcons';
import { renderWalkingPath } from '../utils/walkingPathRenderer';

interface SmallMapProps {
  latitude?: number | null;
  longitude?: number | null;
  className?: string;
  height?: string;
  walkingPath?: {
    name: string;
    distance: number;
    coordinates?: [number, number][];
  };
}

const SmallMap = ({ latitude, longitude, className = '', height = '200px', walkingPath }: SmallMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    // Leaflet 아이콘 초기화
    initializeLeafletIcons();

    // 기존 맵이 있으면 완전히 제거
    if (mapInstanceRef.current) {
      mapInstanceRef.current.off();
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // 맵 컨테이너 내용 정리
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }

    // 새 맵 생성
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
    }).setView([latitude, longitude], 14);

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 산책로 경로 생성 및 표시
    if (walkingPath) {
      renderWalkingPath(map, latitude, longitude, walkingPath);
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [latitude, longitude, walkingPath]);

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
