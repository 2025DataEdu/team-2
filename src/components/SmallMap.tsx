
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Leaflet 기본 아이콘 설정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 산책로 경로를 생성하는 함수 (실제 경로 좌표가 없을 때 가상 경로 생성)
const generateWalkingPath = (centerLat: number, centerLng: number, distance: number, pathName: string): [number, number][] => {
  const coordinates: [number, number][] = [];
  const numPoints = Math.max(20, Math.floor(distance * 10)); // 거리에 따라 점의 개수 조정
  
  // 경로 유형에 따라 다른 패턴 생성
  if (pathName.includes('강변') || pathName.includes('하천')) {
    // 강변: 구불구불한 S자 형태
    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const offsetDistance = (distance / 111) * 0.5; // 대략적인 위도 변환
      
      const lat = centerLat + Math.sin(progress * Math.PI * 4) * offsetDistance * 0.3;
      const lng = centerLng + (progress - 0.5) * offsetDistance * 2;
      coordinates.push([lat, lng]);
    }
  } else if (pathName.includes('둘레') || pathName.includes('순환')) {
    // 둘레길: 원형 또는 타원형
    const radiusLat = (distance / 111) * 0.3;
    const radiusLng = radiusLat / Math.cos(centerLat * Math.PI / 180);
    
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const lat = centerLat + Math.cos(angle) * radiusLat;
      const lng = centerLng + Math.sin(angle) * radiusLng;
      coordinates.push([lat, lng]);
    }
  } else if (pathName.includes('산') || pathName.includes('등산')) {
    // 산길: 지그재그 형태
    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const offsetDistance = (distance / 111) * 0.5;
      
      const lat = centerLat + Math.sin(progress * Math.PI * 6) * offsetDistance * 0.2 + progress * offsetDistance;
      const lng = centerLng + Math.cos(progress * Math.PI * 8) * offsetDistance * 0.3;
      coordinates.push([lat, lng]);
    }
  } else {
    // 일반 직선형 경로 (약간의 곡선 추가)
    for (let i = 0; i <= numPoints; i++) {
      const progress = i / numPoints;
      const offsetDistance = (distance / 111) * 0.5;
      
      const lat = centerLat + Math.sin(progress * Math.PI * 2) * offsetDistance * 0.1;
      const lng = centerLng + (progress - 0.5) * offsetDistance * 1.5;
      coordinates.push([lat, lng]);
    }
  }
  
  return coordinates;
};

const SmallMap = ({ latitude, longitude, className = '', height = '200px', walkingPath }: SmallMapProps) => {
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
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
    }).setView([latitude, longitude], 14);

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 시작점 마커 추가
    const startIcon = L.divIcon({
      html: '<div style="background-color: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      className: 'custom-start-marker'
    });

    L.marker([latitude, longitude], { icon: startIcon }).addTo(map)
      .bindPopup('<div style="font-size: 12px; font-weight: bold; color: #059669;">🚶‍♂️ 출발점</div>');

    // 산책로 경로 생성 및 표시
    if (walkingPath) {
      let pathCoordinates: [number, number][] = [];
      
      if (walkingPath.coordinates && walkingPath.coordinates.length > 0) {
        // 실제 좌표가 있는 경우
        pathCoordinates = walkingPath.coordinates;
      } else {
        // 실제 좌표가 없는 경우 가상 경로 생성
        pathCoordinates = generateWalkingPath(latitude, longitude, walkingPath.distance, walkingPath.name);
      }

      // 경로 라인 그리기
      const pathLine = L.polyline(pathCoordinates, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        dashArray: '10, 5'
      }).addTo(map);

      // 종료점 마커 추가
      if (pathCoordinates.length > 0) {
        const endPoint = pathCoordinates[pathCoordinates.length - 1];
        const endIcon = L.divIcon({
          html: '<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          className: 'custom-end-marker'
        });

        L.marker(endPoint, { icon: endIcon }).addTo(map)
          .bindPopup('<div style="font-size: 12px; font-weight: bold; color: #dc2626;">🏁 도착점</div>');
      }

      // 경로 중간점들에 방향 화살표 추가
      for (let i = 1; i < pathCoordinates.length; i += Math.floor(pathCoordinates.length / 5)) {
        const prevPoint = pathCoordinates[i - 1];
        const currPoint = pathCoordinates[i];
        
        // 방향 계산
        const bearing = Math.atan2(
          currPoint[1] - prevPoint[1],
          currPoint[0] - prevPoint[0]
        ) * 180 / Math.PI;

        const arrowIcon = L.divIcon({
          html: `<div style="transform: rotate(${bearing + 90}deg); font-size: 16px;">➤</div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          className: 'custom-arrow-marker'
        });

        L.marker(currPoint, { icon: arrowIcon }).addTo(map);
      }

      // 경로 정보 표시
      const pathInfo = L.control({ position: 'topright' });
      pathInfo.onAdd = function() {
        const div = L.DomUtil.create('div', 'path-info');
        div.innerHTML = `
          <div style="background: white; padding: 8px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); font-size: 12px;">
            <div style="font-weight: bold; color: #1f2937; margin-bottom: 4px;">🚶‍♂️ ${walkingPath.name}</div>
            <div style="color: #6b7280;">📏 ${walkingPath.distance.toFixed(1)}km</div>
            <div style="color: #3b82f6; margin-top: 4px;">--- 예상 경로</div>
          </div>
        `;
        return div;
      };
      pathInfo.addTo(map);

      // 전체 경로가 보이도록 맵 범위 조정
      try {
        const bounds = L.latLngBounds(pathCoordinates);
        map.fitBounds(bounds, { padding: [20, 20] });
      } catch (error) {
        // 경로 피팅에 실패하면 기본 줌 레벨 사용
        map.setView([latitude, longitude], 14);
      }
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
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
