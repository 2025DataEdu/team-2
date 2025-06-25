
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WalkingPathData, TraditionalMarketData } from '@/hooks/useWalkingPaths';

// Leaflet 기본 아이콘 설정
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WalkingPathMapProps {
  walkingPaths: WalkingPathData[];
  traditionalMarkets: TraditionalMarketData[];
  userLocation?: { latitude: number; longitude: number };
  onPathClick: (path: WalkingPathData) => void;
  className?: string;
}

const WalkingPathMap = ({ 
  walkingPaths, 
  traditionalMarkets, 
  userLocation, 
  onPathClick, 
  className = "w-full h-96" 
}: WalkingPathMapProps) => {
  
  // 거리 계산 함수 (Haversine formula)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 근처 전통시장 찾기 함수
  const findNearbyMarkets = (pathLat: number, pathLng: number, maxDistance = 5) => {
    return traditionalMarkets
      .filter(market => market.경위도X좌표 && market.경위도Y좌표)
      .map(market => {
        const distance = getDistance(
          pathLat, pathLng,
          market.경위도Y좌표!, market.경위도X좌표!
        );
        return { market, distance };
      })
      .filter(item => item.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(item => item.market);
  };

  // 지도 중심점 계산
  const center = useMemo(() => {
    if (userLocation) {
      return [userLocation.latitude, userLocation.longitude] as [number, number];
    }
    
    if (walkingPaths.length > 0) {
      const validPaths = walkingPaths.filter(path => path.Latitude && path.Longitude);
      if (validPaths.length > 0) {
        const centerLat = validPaths.reduce((sum, path) => sum + path.Latitude!, 0) / validPaths.length;
        const centerLng = validPaths.reduce((sum, path) => sum + path.Longitude!, 0) / validPaths.length;
        return [centerLat, centerLng] as [number, number];
      }
    }
    
    return [37.5665, 126.9780] as [number, number]; // 서울 기본 좌표
  }, [walkingPaths, userLocation]);

  // 산책로 아이콘
  const walkingPathIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // 사용자 위치 아이콘 (파란색)
  const userLocationIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41">
        <path fill="#3b82f6" stroke="#fff" stroke-width="2" d="M12.5,0C5.6,0,0,5.6,0,12.5c0,12.5,12.5,28.5,12.5,28.5s12.5-16,12.5-28.5C25,5.6,19.4,0,12.5,0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      </svg>
    `),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

  if (walkingPaths.length === 0) {
    return (
      <div className={`${className} bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center`}>
        <p className="text-gray-500">산책로 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={`${className} rounded-lg border border-gray-200 overflow-hidden`}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 사용자 위치 마커 */}
        {userLocation && (
          <Marker 
            position={[userLocation.latitude, userLocation.longitude]} 
            icon={userLocationIcon}
          >
            <Popup>
              <strong>현재 위치</strong>
            </Popup>
          </Marker>
        )}

        {/* 산책로 마커들 */}
        {walkingPaths.map((path) => {
          if (!path.Latitude || !path.Longitude) return null;
          
          return (
            <Marker
              key={path.CoursCode}
              position={[path.Latitude, path.Longitude]}
              icon={walkingPathIcon}
              eventHandlers={{
                click: () => {
                  const nearbyMarkets = findNearbyMarkets(path.Latitude!, path.Longitude!);
                  onPathClick({ ...path, nearbyMarkets } as any);
                }
              }}
            >
              <Popup>
                <div style={{ padding: '8px', minWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                    {path.CoursName || '산책로'}
                  </h3>
                  <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    {path.CoursLength ? `거리: ${path.CoursLength}` : ''}
                    {path.CoursTime ? ` | 시간: ${path.CoursTime}` : ''}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#16a34a' }}>
                    클릭하여 상세보기
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WalkingPathMap;
