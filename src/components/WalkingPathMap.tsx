
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalkingPathData, TraditionalMarketData } from '@/hooks/useWalkingPaths';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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

  useEffect(() => {
    if (!mapContainer.current || walkingPaths.length === 0) return;

    const storedApiKey = localStorage.getItem('mapbox-api-key');
    if (!storedApiKey && !apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    const currentApiKey = apiKey || storedApiKey;
    if (!currentApiKey || currentApiKey.trim() === '') {
      setShowApiKeyInput(true);
      return;
    }

    try {
      mapboxgl.accessToken = currentApiKey;
      
      if (map.current) {
        map.current.remove();
      }

      // 지도 중심점 계산
      const centerLat = userLocation?.latitude || 
        walkingPaths.reduce((sum, path) => sum + (path.Latitude || 0), 0) / walkingPaths.length;
      const centerLng = userLocation?.longitude || 
        walkingPaths.reduce((sum, path) => sum + (path.Longitude || 0), 0) / walkingPaths.length;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [centerLng, centerLat],
        zoom: 12
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // 기존 마커 제거
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // 사용자 위치 마커
      if (userLocation) {
        const userMarker = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([userLocation.longitude, userLocation.latitude])
          .setPopup(new mapboxgl.Popup().setHTML('<h3>현재 위치</h3>'))
          .addTo(map.current);
        markersRef.current.push(userMarker);
      }

      // 산책로 마커
      walkingPaths.forEach((path) => {
        if (path.Latitude && path.Longitude) {
          const el = document.createElement('div');
          el.className = 'walking-path-marker';
          el.style.cssText = `
            background-color: #16a34a;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          `;
          el.textContent = '산';

          el.addEventListener('click', () => {
            const nearbyMarkets = findNearbyMarkets(path.Latitude!, path.Longitude!);
            onPathClick({ ...path, nearbyMarkets } as any);
          });

          const marker = new mapboxgl.Marker(el)
            .setLngLat([path.Longitude, path.Latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 8px;">
                  <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${path.CoursName || '산책로'}</h3>
                  <p style="margin: 0; font-size: 12px; color: #666;">
                    ${path.CoursLength ? `거리: ${path.CoursLength}` : ''}
                    ${path.CoursTime ? ` | 시간: ${path.CoursTime}` : ''}
                  </p>
                  <p style="margin: 4px 0 0 0; font-size: 11px; color: #16a34a;">클릭하여 상세보기</p>
                </div>
              `)
            )
            .addTo(map.current!);

          markersRef.current.push(marker);
        }
      });

    } catch (error) {
      console.error('Mapbox 지도 로드 오류:', error);
      setShowApiKeyInput(true);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
      }
    };
  }, [walkingPaths, traditionalMarkets, userLocation, apiKey, onPathClick]);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('mapbox-api-key', apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <div className={`${className} bg-gray-100 border border-gray-300 rounded-lg p-6 flex flex-col justify-center items-center`}>
        <div className="text-center space-y-4 w-full max-w-md">
          <p className="text-gray-600">지도를 표시하려면 Mapbox API 키가 필요합니다</p>
          <div className="space-y-2">
            <Label htmlFor="mapbox-api-key">Mapbox Public Token</Label>
            <Input
              id="mapbox-api-key"
              type="text"
              placeholder="pk.eyJ1..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <button
            onClick={handleApiKeySubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            설정
          </button>
          <p className="text-sm text-gray-500">
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              mapbox.com
            </a>에서 무료 토큰을 받을 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={`${className} rounded-lg border border-gray-200`} />;
};

export default WalkingPathMap;
