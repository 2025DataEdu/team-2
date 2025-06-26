
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
  isHidden?: boolean; // 맵을 숨길지 여부
}

const SmallMap = ({ latitude, longitude, className = '', height = '200px', walkingPath, isHidden = false }: SmallMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // 맵 정리 함수
  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
      } catch (error) {
        console.log('Map cleanup error:', error);
      } finally {
        mapInstanceRef.current = null;
      }
    }
    
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }
  };

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude || isHidden) {
      cleanupMap();
      return;
    }

    // Leaflet 아이콘 초기화
    initializeLeafletIcons();

    // 기존 맵 완전히 정리
    cleanupMap();

    // 짧은 지연 후 새 맵 생성 (DOM 정리 시간 확보)
    const createMapTimeout = setTimeout(() => {
      if (!mapRef.current || isHidden) return;

      try {
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
      } catch (error) {
        console.error('Map creation error:', error);
      }
    }, 50);

    return () => {
      clearTimeout(createMapTimeout);
      cleanupMap();
    };
  }, [latitude, longitude, walkingPath, isHidden]);

  if (!latitude || !longitude || isHidden) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center rounded-lg ${className}`}
        style={{ height, display: isHidden ? 'none' : 'flex' }}
      >
        <p className="text-gray-500 text-sm">위치 정보 없음</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg border border-gray-200 ${className}`}
      style={{ height, display: isHidden ? 'none' : 'block' }}
    />
  );
};

export default SmallMap;
